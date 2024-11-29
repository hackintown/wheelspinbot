export const DEV_CONFIG = {
  MOCK_USER_ID: '12345', // Any test user ID
  MOCK_TELEGRAM_DATA: {
    user: {
      id: '12345',
      first_name: 'Test',
      username: 'testuser'
    },
    auth_date: Math.floor(Date.now() / 1000),
    hash: 'test_hash'
  }
}; 