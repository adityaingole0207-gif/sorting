// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Bubble Sort Implementation Using Class
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class BubbleSort {
public:
    // Basic function to swap two numbers using a temporary variable
    void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // Function to perform Bubble Sort on an integer array
    void sort(int arr[], int n) {
        // Outer loop runs n - 1 times for passes
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false; // Flag to optimize if array is already sorted

            // Inner loop compares adjacent elements
            for (int j = 0; j < n - i - 1; j++) {
                // If current element is greater than next element, swap them
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                    swapped = true;
                }
            }

            // If no swaps happened in this pass, the array is already sorted
            if (!swapped) {
                break;
            }
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
    std::cout << "--- Bubble Sort Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    BubbleSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
