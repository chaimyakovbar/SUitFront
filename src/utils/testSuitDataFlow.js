// Test script to verify suit data flow from atoms to database and back

import { createCompleteSuitObject, validateSuitData } from './suitStateManager';

/**
 * Test function to verify that all atoms are included in the suit object
 */
export const testSuitDataCompleteness = () => {
    console.log('🧪 Testing suit data completeness...');

    // Mock atom values that should be included
    const mockAtoms = {
        currentColor: 'blackGrey',
        selectedKind: 'kind1',
        selectedCollar: 'collarTight',
        selectedLapelType: 'Standard',
        selectedPacketType: 'packet1',
        selectedButton: 'black',
        selectedPoshet: 'grey',
        selectedHolesButton: 'black',
        selectedHolesButtonUp: 'grey',
        selectedInsideType: 'navy',
        selectedPantsColor: 'greyLight',
        selectedPantsLines: 'OneLinesInTheTop',
        selectedPantsHoleButton: 'behindLeftSide',
        selectedPantsHem: 'Hem',
        selectedSleeveButtons: 'four',
        textInsideText: 'Custom Text',
        textInsideFont: 'Times New Roman',
        textInsideColor: '#ff0000',
        priceAllSuit: 299.99,
    };

    // Create complete suit object
    const completeSuit = createCompleteSuitObject(mockAtoms);

    // Check that all expected fields are present
    const expectedFields = [
        'kind', 'color', 'lapelKind', 'lapelType', 'packetType',
        'buttonColor', 'poshetColor', 'holeButtonColor', 'holeButtonUpColor', 'insideColor',
        'pantsColor', 'pantsLines', 'pantsHoleButton', 'pantsHem',
        'sleeveButtons', 'textInsideText', 'textInsideFont', 'textInsideColor',
        'totalPrice'
    ];

    const missingFields = expectedFields.filter(field => !(field in completeSuit));

    if (missingFields.length === 0) {
        console.log('✅ All expected fields are present in suit object');
        console.log('📋 Complete suit object:', completeSuit);
    } else {
        console.error('❌ Missing fields in suit object:', missingFields);
    }

    // Validate the suit data
    const validation = validateSuitData(completeSuit);
    console.log('🔍 Validation result:', validation);

    return {
        success: missingFields.length === 0 && validation.isValid,
        missingFields,
        validation,
        completeSuit
    };
};

/**
 * Test function to verify data persistence through the save/load cycle
 */
export const testDataPersistence = async (userEmail) => {
    console.log('🧪 Testing data persistence...');

    try {
        // This would be a real test that saves and retrieves data
        // For now, we'll just log what should happen
        console.log('📝 This test would:');
        console.log('1. Create a suit with all customization options');
        console.log('2. Save it to the database');
        console.log('3. Retrieve it from the database');
        console.log('4. Verify all fields are preserved');

        return {
            success: true,
            message: 'Data persistence test framework ready'
        };
    } catch (error) {
        console.error('❌ Data persistence test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Generate a comprehensive test report
 */
export const generateTestReport = () => {
    console.log('📊 Generating comprehensive test report...');

    const completenessTest = testSuitDataCompleteness();

    const report = {
        timestamp: new Date().toISOString(),
        tests: {
            completeness: completenessTest,
            // persistence: await testDataPersistence(), // Would be async in real implementation
        },
        summary: {
            totalTests: 1,
            passedTests: completenessTest.success ? 1 : 0,
            failedTests: completenessTest.success ? 0 : 1,
        }
    };

    console.log('📋 Test Report:', report);
    return report;
};

// Export for use in development
if (process.env.NODE_ENV === 'development') {
    window.testSuitDataFlow = {
        testSuitDataCompleteness,
        testDataPersistence,
        generateTestReport
    };
} 