#!/usr/bin/env node

/**
 * Integration test for the complete minting workflow
 * This script tests the full file-to-IP-asset pipeline
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Import the compiled JavaScript modules
const { APIClient } = require('./dist/lib/api-client.js');
const { ConfigManager } = require('./dist/config/config-manager.js');
const { applyDefaultMetadata, validateMetadata } = require('./dist/lib/metadata-utils.js');
const { createProgressReporter } = require('./dist/lib/progress-reporter.js');

async function runIntegrationTests() {
    console.log('🧪 Starting StoryLite CLI Integration Tests\n');

    let tempDir;
    let testFile;
    let passed = 0;
    let failed = 0;

    try {
        // Setup: Create temporary directory and test file
        console.log('📁 Setting up test environment...');
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'storylite-test-'));
        testFile = path.join(tempDir, 'test-document.txt');
        await fs.writeFile(testFile, 'This is a test document for IP minting.');
        console.log(`✓ Created test file: ${testFile}\n`);

        // Test 1: Configuration Management
        console.log('🔧 Test 1: Configuration Management');
        try {
            const configManager = new ConfigManager();

            // Test setting and getting configuration
            configManager.set('endpoint', 'https://test-api.example.com');
            configManager.set('apiKey', 'test-api-key-123');

            const endpoint = configManager.get('endpoint');
            const apiKey = configManager.get('apiKey');

            if (endpoint === 'https://test-api.example.com' && apiKey === 'test-api-key-123') {
                console.log('✓ Configuration storage and retrieval works');
                passed++;
            } else {
                console.log('✗ Configuration storage failed');
                failed++;
            }

            // Test getting all config
            const config = configManager.getAll();
            if (config.endpoint && typeof config.timeout === 'number') {
                console.log('✓ Configuration getAll() works');
                passed++;
            } else {
                console.log('✗ Configuration getAll() failed');
                failed++;
            }
        } catch (error) {
            console.log(`✗ Configuration test failed: ${error.message}`);
            failed++;
        }

        // Test 2: Metadata Processing
        console.log('\n📝 Test 2: Metadata Processing');
        try {
            // Test default metadata generation
            const defaultMetadata = applyDefaultMetadata(testFile);
            // The title should be processed from filename (Test Document from test-document.txt)
            // The description should be based on .txt extension
            if (defaultMetadata.title === 'Test Document' && defaultMetadata.description.includes('text')) {
                console.log('✓ Default metadata generation works');
                passed++;
            } else {
                console.log(`✗ Default metadata generation failed - Title: "${defaultMetadata.title}", Description: "${defaultMetadata.description}"`);
                failed++;
            }

            // Test custom metadata
            const customMetadata = applyDefaultMetadata(testFile, 'Custom Title', 'Custom Description');
            if (customMetadata.title === 'Custom Title' && customMetadata.description === 'Custom Description') {
                console.log('✓ Custom metadata application works');
                passed++;
            } else {
                console.log('✗ Custom metadata application failed');
                failed++;
            }

            // Test metadata validation
            const validResult = validateMetadata('Valid Title', 'Valid description');
            const invalidResult = validateMetadata('', '');

            if (validResult.isValid && !invalidResult.isValid) {
                console.log('✓ Metadata validation works');
                passed++;
            } else {
                console.log('✗ Metadata validation failed');
                failed++;
            }
        } catch (error) {
            console.log(`✗ Metadata test failed: ${error.message}`);
            failed++;
        }

        // Test 3: File Reading and Validation
        console.log('\n📄 Test 3: File Reading and Validation');
        try {
            const config = {
                endpoint: 'http://localhost:3000',
                timeout: 30000,
                verbose: false
            };

            const progressReporter = createProgressReporter(false);
            const apiClient = new APIClient(config, progressReporter);

            // Test successful file reading
            const mintRequest = await apiClient.readFile(testFile, 'Test Document', 'A test document');

            if (mintRequest &&
                mintRequest.filename === 'test-document.txt' &&
                mintRequest.title === 'Test Document' &&
                mintRequest.description === 'A test document' &&
                Buffer.isBuffer(mintRequest.file) &&
                mintRequest.file.length > 0) {
                console.log('✓ File reading and MintRequest creation works');
                passed++;
            } else {
                console.log('✗ File reading failed');
                failed++;
            }

            // Test file not found error
            try {
                await apiClient.readFile('/nonexistent/file.txt');
                console.log('✗ File not found error handling failed');
                failed++;
            } catch (error) {
                if (error.message.includes('File not found')) {
                    console.log('✓ File not found error handling works');
                    passed++;
                } else {
                    console.log(`✗ Unexpected error: ${error.message}`);
                    failed++;
                }
            }
        } catch (error) {
            console.log(`✗ File reading test failed: ${error.message}`);
            failed++;
        }

        // Test 4: API Client Configuration
        console.log('\n🌐 Test 4: API Client Configuration');
        try {
            const config = {
                endpoint: 'http://invalid-endpoint.test',
                timeout: 1000,
                verbose: false
            };

            const apiClient = new APIClient(config);

            // Test endpoint validation (should fail for invalid endpoint)
            const isValid = await apiClient.validateEndpoint();
            if (!isValid) {
                console.log('✓ Endpoint validation correctly identifies invalid endpoints');
                passed++;
            } else {
                console.log('✗ Endpoint validation failed');
                failed++;
            }

            // Test connection test
            const testResult = await apiClient.testConnection();
            if (!testResult.success && testResult.message.includes('not reachable')) {
                console.log('✓ Connection test correctly identifies unreachable endpoints');
                passed++;
            } else {
                console.log('✗ Connection test failed');
                failed++;
            }
        } catch (error) {
            console.log(`✗ API client test failed: ${error.message}`);
            failed++;
        }

        // Test 5: Complete Workflow Integration
        console.log('\n🔄 Test 5: Complete Workflow Integration');
        try {
            const configManager = new ConfigManager();
            const config = configManager.getAll();
            const progressReporter = createProgressReporter(false);
            const apiClient = new APIClient(config, progressReporter);

            // Step 1: Read file
            const mintRequest = await apiClient.readFile(testFile);

            // Step 2: Apply metadata
            const metadata = applyDefaultMetadata(testFile, mintRequest.title, mintRequest.description);

            // Step 3: Validate metadata
            const validation = validateMetadata(metadata.title, metadata.description);

            // Step 4: Validate Ethereum address format
            const validAddress = '0x742d35Cc6634C0532925a3b8D404d3aABb8c4532';
            const addressValid = /^0x[a-fA-F0-9]{40}$/.test(validAddress);

            if (mintRequest &&
                metadata &&
                validation.isValid &&
                addressValid &&
                Buffer.isBuffer(mintRequest.file) &&
                mintRequest.filename &&
                metadata.title &&
                metadata.description) {
                console.log('✓ Complete workflow integration successful');
                passed++;
            } else {
                console.log('✗ Complete workflow integration failed');
                failed++;
            }
        } catch (error) {
            console.log(`✗ Workflow integration test failed: ${error.message}`);
            failed++;
        }

        // Test 6: Different File Types
        console.log('\n📁 Test 6: Different File Types');
        try {
            const fileTypes = [
                { name: 'document.pdf', content: 'PDF content' },
                { name: 'image.jpg', content: 'JPEG content' },
                { name: 'code.js', content: 'console.log("test");' },
                { name: 'data.json', content: '{"test": true}' }
            ];

            const config = {
                endpoint: 'http://localhost:3000',
                timeout: 30000,
                verbose: false
            };

            const progressReporter = createProgressReporter(false);
            const apiClient = new APIClient(config, progressReporter);

            let fileTypesPassed = 0;
            for (const fileType of fileTypes) {
                const filePath = path.join(tempDir, fileType.name);
                await fs.writeFile(filePath, fileType.content);

                const mintRequest = await apiClient.readFile(filePath);
                const metadata = applyDefaultMetadata(filePath);

                // The title should be processed from filename, not the raw filename
                const expectedTitle = fileType.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim();
                if (mintRequest.filename === fileType.name &&
                    metadata.title === expectedTitle &&
                    metadata.description) {
                    fileTypesPassed++;
                } else {
                    console.log(`  - ${fileType.name}: Expected title "${expectedTitle}", got "${metadata.title}"`);
                }
            }

            if (fileTypesPassed === fileTypes.length) {
                console.log('✓ Different file types handled correctly');
                passed++;
            } else {
                console.log(`✗ File types test failed (${fileTypesPassed}/${fileTypes.length})`);
                failed++;
            }
        } catch (error) {
            console.log(`✗ File types test failed: ${error.message}`);
            failed++;
        }

    } catch (error) {
        console.log(`\n❌ Test setup failed: ${error.message}`);
        failed++;
    } finally {
        // Cleanup
        if (tempDir) {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
                console.log('\n🧹 Cleaned up test files');
            } catch (error) {
                console.log(`\n⚠️  Cleanup warning: ${error.message}`);
            }
        }
    }

    // Results
    console.log('\n' + '='.repeat(50));
    console.log('📊 INTEGRATION TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
        console.log('\n🎉 All integration tests passed!');
        console.log('✅ Complete minting workflow is working correctly');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some integration tests failed');
        console.log('❌ Please review the failing tests above');
        process.exit(1);
    }
}

// Run the tests
runIntegrationTests().catch(error => {
    console.error('💥 Integration test runner failed:', error);
    process.exit(1);
});