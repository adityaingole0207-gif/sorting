// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Insertion Sort Implementation Using Class
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class InsertionSort {
public:
    // Function to perform Insertion Sort on an integer array
    void sort(int arr[], int n) {
        // Start from index 1 because single element at index 0 is already sorted
        for (int i = 1; i < n; i++) {
            int key = arr[i]; // Element to insert into sorted prefix
            int j = i - 1;

            // Shift elements of arr[0..i-1] that are greater than key to one position ahead
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }

            // Place the key at its correct sorted position
            arr[j + 1] = key;
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
    std::cout << "--- Insertion Sort Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);

    InsertionSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
