const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const logPass = (testName) =>
  console.log(`${colors.green}  ✓ [PASS]${colors.reset} ${testName}`);
const logFail = (testName, details) =>
  console.log(`${colors.red}  ✗ [FAIL]${colors.reset} ${testName}\n    -> ${details}`);

const request = async (baseUrl, path, method = 'GET', body = null, token = null) => {
  const url = new URL(path, baseUrl);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), options);
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, data };
};

async function runTestSuite() {
  console.log(`\n${colors.bold}${colors.cyan}=== DEVSPHERE FULL-STACK BLOG API TEST SUITE ===${colors.reset}\n`);

  let mongoServer;
  let server;
  let passedTests = 0;
  let failedTests = 0;

  try {
    // 1. Initialize In-Memory MongoDB
    console.log('[Test Setup] Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
    process.env.PORT = '5099';
    process.env.JWT_SECRET = 'test_secret_jwt_key_1234567890';

    await mongoose.connect(mongoUri);
    console.log('[Test Setup] Connected to in-memory MongoDB.');

    // 2. Start Express app
    const app = require('./server');
    const port = 5099;
    const baseUrl = `http://localhost:${port}`;

    let user1Token = '';
    let user1Id = '';
    let user2Token = '';
    let user2Id = '';
    let createdPostId = '';
    let createdCommentId = '';

    console.log('\n--- Running Test Cases ---');

    // Test 1: Health check
    {
      const res = await request(baseUrl, '/api/health');
      if (res.status === 200 && res.data?.status === 'OK') {
        logPass('Health Check Endpoint (GET /api/health)');
        passedTests++;
      } else {
        logFail('Health Check Endpoint', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 2: User 1 Registration
    {
      const res = await request(baseUrl, '/api/auth/register', 'POST', {
        name: 'Alice Developer',
        email: 'alice@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      if (res.status === 201 && res.data?.data?.token) {
        user1Token = res.data.data.token;
        user1Id = res.data.data.user._id;
        logPass('User Registration (POST /api/auth/register)');
        passedTests++;
      } else {
        logFail('User Registration', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 3: Duplicate Registration Prevention
    {
      const res = await request(baseUrl, '/api/auth/register', 'POST', {
        name: 'Alice Duplicate',
        email: 'alice@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      if (res.status === 400 && res.data?.success === false) {
        logPass('Prevent Duplicate Email Registration (POST /api/auth/register -> 400)');
        passedTests++;
      } else {
        logFail('Prevent Duplicate Email Registration', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 4: User 1 Login
    {
      const res = await request(baseUrl, '/api/auth/login', 'POST', {
        email: 'alice@test.com',
        password: 'Password123!',
      });
      if (res.status === 200 && res.data?.data?.token) {
        logPass('User Login (POST /api/auth/login)');
        passedTests++;
      } else {
        logFail('User Login', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 5: Invalid Password Login
    {
      const res = await request(baseUrl, '/api/auth/login', 'POST', {
        email: 'alice@test.com',
        password: 'WrongPassword!',
      });
      if (res.status === 401 && res.data?.success === false) {
        logPass('Reject Invalid Password (POST /api/auth/login -> 401)');
        passedTests++;
      } else {
        logFail('Reject Invalid Password', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 6: Auth Me Profile
    {
      const res = await request(baseUrl, '/api/auth/me', 'GET', null, user1Token);
      if (res.status === 200 && res.data?.data?.user?.email === 'alice@test.com') {
        logPass('Get Authenticated User Profile (GET /api/auth/me)');
        passedTests++;
      } else {
        logFail('Get Authenticated User Profile', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 7: Register User 2 for Authorization Testing
    {
      const res = await request(baseUrl, '/api/auth/register', 'POST', {
        name: 'Bob Designer',
        email: 'bob@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      if (res.status === 201 && res.data?.data?.token) {
        user2Token = res.data.data.token;
        user2Id = res.data.data.user._id;
        logPass('Register Second User (Bob Designer)');
        passedTests++;
      } else {
        logFail('Register Second User', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 8: Create Blog Post as User 1
    {
      const res = await request(baseUrl, '/api/posts', 'POST', {
        title: 'Deep Dive into Node.js Event Loop',
        content: 'The Node.js event loop is single-threaded and processes phases including timers, pending callbacks, poll, check, and close callbacks.',
        category: 'Technology',
        tags: ['Nodejs', 'Backend', 'Javascript'],
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
      }, user1Token);

      if (res.status === 201 && res.data?.data?._id) {
        createdPostId = res.data.data._id;
        logPass('Create Blog Post (POST /api/posts)');
        passedTests++;
      } else {
        logFail('Create Blog Post', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 9: Get All Posts with Search & Category
    {
      const res = await request(baseUrl, '/api/posts?category=Technology&search=Event');
      if (res.status === 200 && res.data?.data?.length === 1) {
        logPass('Fetch All Posts with Filters & Search (GET /api/posts)');
        passedTests++;
      } else {
        logFail('Fetch All Posts with Filters', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 10: Get Single Post by ID
    {
      const res = await request(baseUrl, `/api/posts/${createdPostId}`);
      if (res.status === 200 && res.data?.data?.title === 'Deep Dive into Node.js Event Loop') {
        logPass('Get Post Detail by ID (GET /api/posts/:id)');
        passedTests++;
      } else {
        logFail('Get Post Detail by ID', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 11: Add Comment as User 1
    {
      const res = await request(baseUrl, `/api/posts/${createdPostId}/comments`, 'POST', {
        content: 'Excellent overview of the poll phase!',
      }, user1Token);

      if (res.status === 201 && res.data?.data?._id) {
        createdCommentId = res.data.data._id;
        logPass('Add Comment to Post (POST /api/posts/:postId/comments)');
        passedTests++;
      } else {
        logFail('Add Comment to Post', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 12: Authorization Test - User 2 attempts to edit User 1's comment
    {
      const res = await request(baseUrl, `/api/comments/${createdCommentId}`, 'PUT', {
        content: 'Hacked comment attempt',
      }, user2Token);

      if (res.status === 403 && res.data?.success === false) {
        logPass('Authorization Guard: User 2 cannot edit User 1 comment (PUT /api/comments/:id -> 403 Forbidden)');
        passedTests++;
      } else {
        logFail('Authorization Guard: User 2 edit User 1 comment', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 13: Authorization Test - User 2 attempts to edit User 1's post
    {
      const res = await request(baseUrl, `/api/posts/${createdPostId}`, 'PUT', {
        title: 'Hacked Post Title Attempt',
        content: 'Hacked content',
      }, user2Token);

      if (res.status === 403 && res.data?.success === false) {
        logPass('Authorization Guard: User 2 cannot edit User 1 post (PUT /api/posts/:id -> 403 Forbidden)');
        passedTests++;
      } else {
        logFail('Authorization Guard: User 2 edit User 1 post', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 14: Edit Comment by Owner (User 1)
    {
      const res = await request(baseUrl, `/api/comments/${createdCommentId}`, 'PUT', {
        content: 'Updated: Excellent overview of the microtask queue!',
      }, user1Token);

      if (res.status === 200 && res.data?.data?.content.includes('microtask queue')) {
        logPass('Owner Edit Comment (PUT /api/comments/:id)');
        passedTests++;
      } else {
        logFail('Owner Edit Comment', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 15: Edit Post by Owner (User 1)
    {
      const res = await request(baseUrl, `/api/posts/${createdPostId}`, 'PUT', {
        title: 'Deep Dive into Node.js Event Loop & Microtasks',
      }, user1Token);

      if (res.status === 200 && res.data?.data?.title.includes('Microtasks')) {
        logPass('Owner Edit Post (PUT /api/posts/:id)');
        passedTests++;
      } else {
        logFail('Owner Edit Post', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 16: User Dashboard Posts
    {
      const res = await request(baseUrl, '/api/posts/user/me', 'GET', null, user1Token);
      if (res.status === 200 && res.data?.data?.posts?.length === 1 && res.data?.data?.stats?.totalPosts === 1) {
        logPass('User Dashboard Metrics & Posts (GET /api/posts/user/me)');
        passedTests++;
      } else {
        logFail('User Dashboard Posts', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 17: Delete Comment by Owner
    {
      const res = await request(baseUrl, `/api/comments/${createdCommentId}`, 'DELETE', null, user1Token);
      if (res.status === 200 && res.data?.success === true) {
        logPass('Owner Delete Comment (DELETE /api/comments/:id)');
        passedTests++;
      } else {
        logFail('Owner Delete Comment', JSON.stringify(res));
        failedTests++;
      }
    }

    // Test 18: Delete Post by Owner
    {
      const res = await request(baseUrl, `/api/posts/${createdPostId}`, 'DELETE', null, user1Token);
      if (res.status === 200 && res.data?.success === true) {
        logPass('Owner Delete Post (DELETE /api/posts/:id)');
        passedTests++;
      } else {
        logFail('Owner Delete Post', JSON.stringify(res));
        failedTests++;
      }
    }

    // Summary
    console.log('\n==============================================');
    console.log(`${colors.bold}TEST SUITE RESULTS:${colors.reset}`);
    console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
    console.log(`  Failed: ${failedTests > 0 ? colors.red : colors.green}${failedTests}${colors.reset}`);
    console.log('==============================================\n');

    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();

    if (failedTests > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Test Suite Fatal Error:', error);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
}

runTestSuite();
