# API Code Snippets Cursor Rules

## Overview
This file contains cursor rules for generating code snippets in Node.js, Go, Python, Java, and cURL for API interactions. Use these rules to quickly add API-related code to your projects.

## Node.js API Snippets

### Basic HTTP Client Setup
```javascript
const axios = require('axios');

class APIClient {
    constructor(baseURL, apiKey) {
        this.baseURL = baseURL.replace(/\/$/, '');
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    async makeRequest(method, endpoint, data = null) {
        try {
            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: this.headers,
                ...(data && { data })
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}
```

### GET Request
```javascript
async getData(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.makeRequest('GET', url);
}
```

### POST Request
```javascript
async postData(endpoint, data) {
    return this.makeRequest('POST', endpoint, data);
}
```

### PUT Request
```javascript
async updateData(endpoint, data) {
    return this.makeRequest('PUT', endpoint, data);
}
```

### DELETE Request
```javascript
async deleteData(endpoint) {
    return this.makeRequest('DELETE', endpoint);
}
```

### Error Handling
```javascript
async handleRequest(requestFn) {
    try {
        return await requestFn();
    } catch (error) {
        if (error.response) {
            console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Request error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}
```

## Go API Snippets

### Basic HTTP Client Setup
```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

type APIClient struct {
    BaseURL    string
    APIKey     string
    HTTPClient *http.Client
}

func NewAPIClient(baseURL, apiKey string) *APIClient {
    return &APIClient{
        BaseURL: baseURL,
        APIKey:  apiKey,
        HTTPClient: &http.Client{
            Timeout: time.Second * 30,
        },
    }
}

func (c *APIClient) makeRequest(method, endpoint string, body interface{}) (*http.Response, error) {
    var reqBody io.Reader
    if body != nil {
        jsonBody, err := json.Marshal(body)
        if err != nil {
            return nil, err
        }
        reqBody = bytes.NewBuffer(jsonBody)
    }

    req, err := http.NewRequest(method, c.BaseURL+endpoint, reqBody)
    if err != nil {
        return nil, err
    }

    req.Header.Set("Authorization", "Bearer "+c.APIKey)
    req.Header.Set("Content-Type", "application/json")

    return c.HTTPClient.Do(req)
}
```

### GET Request
```go
func (c *APIClient) GetData(endpoint string, result interface{}) error {
    resp, err := c.makeRequest("GET", endpoint, nil)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("GET request failed: %s", resp.Status)
    }

    return json.NewDecoder(resp.Body).Decode(result)
}
```

### POST Request
```go
func (c *APIClient) PostData(endpoint string, data, result interface{}) error {
    resp, err := c.makeRequest("POST", endpoint, data)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
        return fmt.Errorf("POST request failed: %s", resp.Status)
    }

    if result != nil {
        return json.NewDecoder(resp.Body).Decode(result)
    }
    return nil
}
```

### PUT Request
```go
func (c *APIClient) UpdateData(endpoint string, data, result interface{}) error {
    resp, err := c.makeRequest("PUT", endpoint, data)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("PUT request failed: %s", resp.Status)
    }

    if result != nil {
        return json.NewDecoder(resp.Body).Decode(result)
    }
    return nil
}
```

### DELETE Request
```go
func (c *APIClient) DeleteData(endpoint string) error {
    resp, err := c.makeRequest("DELETE", endpoint, nil)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
        return fmt.Errorf("DELETE request failed: %s", resp.Status)
    }

    return nil
}
```

## Python API Snippets

### Basic HTTP Client Setup
```python
import requests
import json
from typing import Dict, List, Optional, Any
from requests.exceptions import RequestException

class APIClient:
    def __init__(self, base_url: str, api_key: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.timeout = timeout
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                json=data,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json() if response.content else {}
        except RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
```

### GET Request
```python
def get_data(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
    """Make GET request"""
    return self._make_request('GET', endpoint, params=params)
```

### POST Request
```python
def post_data(self, endpoint: str, data: Dict) -> Dict:
    """Make POST request"""
    return self._make_request('POST', endpoint, data=data)
```

### PUT Request
```python
def update_data(self, endpoint: str, data: Dict) -> Dict:
    """Make PUT request"""
    return self._make_request('PUT', endpoint, data=data)
```

### DELETE Request
```python
def delete_data(self, endpoint: str) -> bool:
    """Make DELETE request"""
    try:
        self._make_request('DELETE', endpoint)
        return True
    except Exception:
        return False
```

### Error Handling
```python
def handle_request(self, request_func, *args, **kwargs):
    """Generic error handler for API requests"""
    try:
        return request_func(*args, **kwargs)
    except Exception as e:
        print(f"Request failed: {str(e)}")
        raise
```

## Java API Snippets

### Basic HTTP Client Setup
```java
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import java.io.IOException;
import java.util.Map;

public class APIClient {
    private final String baseURL;
    private final String apiKey;
    private final OkHttpClient client;
    private final ObjectMapper objectMapper;

    public APIClient(String baseURL, String apiKey) {
        this.baseURL = baseURL.replaceAll("/$", "");
        this.apiKey = apiKey;
        this.client = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    private Request.Builder createRequestBuilder(String endpoint) {
        return new Request.Builder()
                .url(baseURL + endpoint)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json");
    }

    private <T> T makeRequest(Request request, Class<T> responseType) throws IOException {
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Request failed: " + response.code());
            }
            if (response.body() == null) {
                return null;
            }
            return objectMapper.readValue(response.body().string(), responseType);
        }
    }
```

### GET Request
```java
public <T> T getData(String endpoint, Class<T> responseType) throws IOException {
    Request request = createRequestBuilder(endpoint)
            .get()
            .build();
    return makeRequest(request, responseType);
}
```

### POST Request
```java
public <T> T postData(String endpoint, Object data, Class<T> responseType) throws IOException {
    String json = objectMapper.writeValueAsString(data);
    RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));
    
    Request request = createRequestBuilder(endpoint)
            .post(body)
            .build();
    return makeRequest(request, responseType);
}
```

### PUT Request
```java
public <T> T updateData(String endpoint, Object data, Class<T> responseType) throws IOException {
    String json = objectMapper.writeValueAsString(data);
    RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));
    
    Request request = createRequestBuilder(endpoint)
            .put(body)
            .build();
    return makeRequest(request, responseType);
}
```

### DELETE Request
```java
public boolean deleteData(String endpoint) throws IOException {
    Request request = createRequestBuilder(endpoint)
            .delete()
            .build();
    
    try (Response response = client.newCall(request).execute()) {
        return response.isSuccessful();
    }
}
```

### Error Handling
```java
public <T> T handleRequest(Supplier<T> requestSupplier) {
    try {
        return requestSupplier.get();
    } catch (Exception e) {
        System.err.println("Request failed: " + e.getMessage());
        throw new RuntimeException(e);
    }
}
```

## cURL API Snippets

### Basic GET Request
```bash
curl -X GET "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### GET Request with Query Parameters
```bash
curl -X GET "https://api.example.com/endpoint?param1=value1&param2=value2" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### POST Request with JSON Data
```bash
curl -X POST "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "key1": "value1",
    "key2": "value2"
  }'
```

### POST Request with File Upload
```bash
curl -X POST "https://api.example.com/upload" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@/path/to/file.txt" \
  -F "description=File description"
```

### PUT Request
```bash
curl -X PUT "https://api.example.com/endpoint/123" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "key1": "updated_value1",
    "key2": "updated_value2"
  }'
```

### DELETE Request
```bash
curl -X DELETE "https://api.example.com/endpoint/123" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### PATCH Request
```bash
curl -X PATCH "https://api.example.com/endpoint/123" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "key1": "partial_update"
  }'
```

### Request with Custom Headers
```bash
curl -X POST "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: custom_value" \
  -H "Accept: application/json" \
  -d '{"data": "value"}'
```

### Request with Basic Auth
```bash
curl -X GET "https://api.example.com/endpoint" \
  -u "username:password" \
  -H "Content-Type: application/json"
```

### Request with Form Data
```bash
curl -X POST "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "param1=value1&param2=value2"
```

### Save Response to File
```bash
curl -X GET "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o response.json
```

### Verbose Output
```bash
curl -v -X GET "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Follow Redirects
```bash
curl -L -X GET "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Common API Patterns

### Rate Limiting Handler
```javascript
// Node.js
class RateLimitedAPI extends APIClient {
    constructor(baseURL, apiKey, maxRequestsPerMinute = 60) {
        super(baseURL, apiKey);
        this.maxRequestsPerMinute = maxRequestsPerMinute;
        this.requestCount = 0;
        this.lastResetTime = Date.now();
    }

    async makeRequest(method, endpoint, data = null) {
        this.checkRateLimit();
        this.requestCount++;
        return super.makeRequest(method, endpoint, data);
    }

    checkRateLimit() {
        const now = Date.now();
        if (now - this.lastResetTime >= 60000) {
            this.requestCount = 0;
            this.lastResetTime = now;
        }
        
        if (this.requestCount >= this.maxRequestsPerMinute) {
            const waitTime = 60000 - (now - this.lastResetTime);
            throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
        }
    }
}
```

### Retry Logic
```python
# Python
import time
from functools import wraps

def retry_on_failure(max_retries=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        time.sleep(delay * (2 ** attempt))  # Exponential backoff
                    continue
            raise last_exception
        return wrapper
    return decorator
```

### Request/Response Logging
```go
// Go
func (c *APIClient) makeRequestWithLogging(method, endpoint string, body interface{}) (*http.Response, error) {
    log.Printf("Making %s request to %s", method, endpoint)
    
    resp, err := c.makeRequest(method, endpoint, body)
    if err != nil {
        log.Printf("Request failed: %v", err)
        return nil, err
    }
    
    log.Printf("Response status: %s", resp.Status)
    return resp, nil
}
```

## Usage Examples

### Node.js Example
```javascript
const api = new APIClient('https://api.example.com', 'your-api-key');

// Get data
const users = await api.getData('/users', { page: 1, limit: 10 });

// Create user
const newUser = await api.postData('/users', {
    name: 'John Doe',
    email: 'john@example.com'
});

// Update user
const updatedUser = await api.updateData('/users/123', {
    name: 'John Smith'
});

// Delete user
await api.deleteData('/users/123');
```

### Python Example
```python
api = APIClient('https://api.example.com', 'your-api-key')

# Get data
users = api.get_data('/users', params={'page': 1, 'limit': 10})

# Create user
new_user = api.post_data('/users', {
    'name': 'John Doe',
    'email': 'john@example.com'
})

# Update user
updated_user = api.update_data('/users/123', {
    'name': 'John Smith'
})

# Delete user
api.delete_data('/users/123')
```

### Go Example
```go
api := NewAPIClient("https://api.example.com", "your-api-key")

// Get data
var users []User
err := api.GetData("/users", &users)

// Create user
newUser := User{Name: "John Doe", Email: "john@example.com"}
var createdUser User
err = api.PostData("/users", newUser, &createdUser)

// Update user
updates := map[string]interface{}{"name": "John Smith"}
var updatedUser User
err = api.UpdateData("/users/123", updates, &updatedUser)

// Delete user
err = api.DeleteData("/users/123")
```

### Java Example
```java
APIClient api = new APIClient("https://api.example.com", "your-api-key");

// Get data
List<User> users = api.getData("/users", new TypeReference<List<User>>() {});

// Create user
User newUser = new User("John Doe", "john@example.com");
User createdUser = api.postData("/users", newUser, User.class);

// Update user
User updates = new User();
updates.setName("John Smith");
User updatedUser = api.updateData("/users/123", updates, User.class);

// Delete user
boolean deleted = api.deleteData("/users/123");
```

### cURL Examples
```bash
# Get all users
curl -X GET "https://api.example.com/users" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Create a new user
curl -X POST "https://api.example.com/users" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Update a user
curl -X PUT "https://api.example.com/users/123" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith"}'

# Delete a user
curl -X DELETE "https://api.example.com/users/123" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Environment Variables Setup

### Node.js
```javascript
require('dotenv').config();

const api = new APIClient(
    process.env.API_BASE_URL,
    process.env.API_KEY
);
```

### Python
```python
import os
from dotenv import load_dotenv

load_dotenv()

api = APIClient(
    os.getenv('API_BASE_URL'),
    os.getenv('API_KEY')
)
```

### Go
```go
package main

import (
    "log"
    "os"
    "github.com/joho/godotenv"
)

func init() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
}

func main() {
    api := NewAPIClient(
        os.Getenv("API_BASE_URL"),
        os.Getenv("API_KEY"),
    )
    // ... rest of your code
}
```

### Java
```java
import java.io.FileInputStream;
import java.util.Properties;

public class Main {
    public static void main(String[] args) {
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(".env")) {
            props.load(fis);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        APIClient api = new APIClient(
            props.getProperty("API_BASE_URL"),
            props.getProperty("API_KEY")
        );
        // ... rest of your code
    }
}
```

## .env File Template
```bash
# API Configuration
API_BASE_URL=https://api.example.com
API_KEY=your-secure-api-key-here
API_TIMEOUT=30000

# Optional: Rate Limiting
API_MAX_REQUESTS_PER_MINUTE=60
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
```

This comprehensive cursor rules file provides ready-to-use code snippets for API interactions in Node.js, Go, Python, Java, and cURL. You can now use these patterns to quickly add API functionality to your projects. 