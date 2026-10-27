// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Adaptive Sort Implementation Using Class
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class AdaptiveSort {
private:
    // Helper function to swap two numbers
    void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // Basic insertion sort for small arrays
    void insertionSort(int arr[], int n) {
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    // Partition helper for quick sort
    int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        return i + 1;
    }

    // Recursive quick sort helper
    void quickSort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

public:
    // Adaptive sort chooses the best strategy based on input state:
    // 1. If already sorted -> Returns immediately in O(n)
    // 2. If reverse sorted -> Inverts array in-place in O(n)
    // 3. If small array (n < 16) -> Uses Insertion Sort
    // 4. Otherwise -> Uses Quick Sort
    void sort(int arr[], int n) {
        if (n <= 1) return;

        // Check 1: Is array already sorted?
        bool isSorted = true;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                isSorted = false;
                break;
            }
        }
        if (isSorted) {
            std::cout << "[Adaptive Strategy: Array was already sorted! O(n) scan]\n";
            return;
        }

        // Check 2: Is array reverse sorted?
        bool isReverse = true;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                isReverse = false;
                break;
            }
        }
        if (isReverse) {
            std::cout << "[Adaptive Strategy: Strictly reversed! In-place two-pointer reversal]\n";
            int left = 0;
            int right = n - 1;
            while (left < right) {
                swap(arr[left], arr[right]);
                left++;
                right--;
            }
            return;
        }

        // Check 3: For small arrays, insertion sort is fastest
        if (n < 16) {
            std::cout << "[Adaptive Strategy: Small array (n < 16). Selected Insertion Sort]\n";
            insertionSort(arr, n);
        } else {
            // General case: Quick Sort
            std::cout << "[Adaptive Strategy: General unsorted sequence. Selected Quick Sort]\n";
            quickSort(arr, 0, n - 1);
        }
    }

    // Helper function to print the array elements
    void printArray(int arr[], int n) {
        for (int i = 0; i < n; i++) {
            std::cout << arr[i] << " ";
        }
        std::cout << "\n";
    }
};

int main() {
    std::cout << "--- Adaptive Sort Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    // Test with reverse array
    int arr[] = {90, 70, 50, 40, 30, 20, 10};
    int n = sizeof(arr) / sizeof(arr[0]);

    AdaptiveSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
