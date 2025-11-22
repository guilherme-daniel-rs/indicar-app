// Teste simples do app
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testAppAPI() {
  try {
    console.log('Testando API do app...');
    
    // Teste 1: Signup
    console.log('\n1. Testando signup...');
    const signupData = {
      email: 'app@teste.com',
      full_name: 'App Teste',
      password: '123456',
      phone: '11999999999',
      role: 'evaluator'
    };
    
    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Signup Success:', {
      access_token: signupResponse.data.access_token ? 'Present' : 'Missing',
      refresh_token: signupResponse.data.refresh_token ? 'Present' : 'Missing',
      user: signupResponse.data.user ? 'Present' : 'Missing'
    });
    
    // Teste 2: Login
    console.log('\n2. Testando login...');
    const loginData = {
      email: 'app@teste.com',
      password: '123456'
    };
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Login Success:', {
      access_token: loginResponse.data.access_token ? 'Present' : 'Missing',
      refresh_token: loginResponse.data.refresh_token ? 'Present' : 'Missing',
      user: loginResponse.data.user ? 'Present' : 'Missing'
    });
    
    // Teste 3: Me com token
    console.log('\n3. Testando /me...');
    const meResponse = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      }
    });
    console.log('Me Success:', meResponse.data);
    
  } catch (error) {
    console.error('Erro no teste do app:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testAppAPI();
