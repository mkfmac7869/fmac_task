// Comprehensive database connectivity test
import { FirebaseService } from '@/lib/firebaseService';
import { auth } from '@/lib/firebaseClient';

export const testDatabaseConnectivity = async () => {
  const results = {
    authentication: false,
    profiles: false,
    projects: false,
    tasks: false,
    departments: false,
    comments: false,
    errors: [] as string[]
  };

  try {
    console.log('🧪 Starting comprehensive database connectivity test...');

    // Test 1: Authentication
    console.log('1. Testing authentication...');
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        results.authentication = true;
        console.log('✅ Authentication: User is logged in');
      } else {
        results.errors.push('No authenticated user found');
        console.log('❌ Authentication: No user logged in');
      }
    } catch (error) {
      results.errors.push(`Authentication error: ${error}`);
      console.log('❌ Authentication failed:', error);
    }

    // Test 2: Profiles Collection
    console.log('2. Testing profiles collection...');
    try {
      const profiles = await FirebaseService.getDocuments('profiles');
      results.profiles = true;
      console.log(`✅ Profiles: Found ${profiles.length} profiles`);
    } catch (error) {
      results.errors.push(`Profiles error: ${error}`);
      console.log('❌ Profiles collection failed:', error);
    }

    // Test 3: Projects Collection
    console.log('3. Testing projects collection...');
    try {
      const projects = await FirebaseService.getDocuments('projects');
      results.projects = true;
      console.log(`✅ Projects: Found ${projects.length} projects`);
    } catch (error) {
      results.errors.push(`Projects error: ${error}`);
      console.log('❌ Projects collection failed:', error);
    }

    // Test 4: Tasks Collection
    console.log('4. Testing tasks collection...');
    try {
      const tasks = await FirebaseService.getDocuments('tasks');
      results.tasks = true;
      console.log(`✅ Tasks: Found ${tasks.length} tasks`);
    } catch (error) {
      results.errors.push(`Tasks error: ${error}`);
      console.log('❌ Tasks collection failed:', error);
    }

    // Test 5: Departments Collection
    console.log('5. Testing departments collection...');
    try {
      const departments = await FirebaseService.getDocuments('departments');
      results.departments = true;
      console.log(`✅ Departments: Found ${departments.length} departments`);
    } catch (error) {
      results.errors.push(`Departments error: ${error}`);
      console.log('❌ Departments collection failed:', error);
    }

    // Test 6: Comments Collection
    console.log('6. Testing comments collection...');
    try {
      const comments = await FirebaseService.getDocuments('task_comments');
      results.comments = true;
      console.log(`✅ Comments: Found ${comments.length} comments`);
    } catch (error) {
      results.errors.push(`Comments error: ${error}`);
      console.log('❌ Comments collection failed:', error);
    }

    // Summary
    const totalTests = 6;
    const passedTests = Object.values(results).filter(v => v === true).length - 1; // -1 for errors array
    const successRate = (passedTests / totalTests) * 100;

    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors found:');
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    return {
      success: successRate >= 80,
      results,
      summary: {
        totalTests,
        passedTests,
        successRate,
        errors: results.errors.length
      }
    };

  } catch (error) {
    console.error('❌ Database test failed:', error);
    results.errors.push(`General error: ${error}`);
    return {
      success: false,
      results,
      summary: {
        totalTests: 6,
        passedTests: 0,
        successRate: 0,
        errors: results.errors.length
      }
    };
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).testDatabaseConnectivity = testDatabaseConnectivity;
}
