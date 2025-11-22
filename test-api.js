// Teste simples da API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testAPI() {
  try {
    console.log('Testando API...');
    
    // Teste 1: Health check
    console.log('\n1. Testando /health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('Health:', healthResponse.data);
    
    // Teste 2: Signup
    console.log('\n2. Testando /auth/signup...');
    const signupData = {
      email: 'teste2@teste.com',
      full_name: 'Teste Usuario 2',
      password: '123456',
      phone: '11999999999',
      role: 'evaluator'
    };
    
    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Signup Success:', signupResponse.data);
    
    // Teste 3: Login
    console.log('\n3. Testando /auth/login...');
    const loginData = {
      email: 'teste2@teste.com',
      password: '123456'
    };
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Login Success:', loginResponse.data);
    
  } catch (error) {
    console.error('Erro no teste:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
  }
}

testAPI();
