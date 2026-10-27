// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Selection Sort Implementation Using Class
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class SelectionSort {
private:
    // Basic function to swap two integers using a temporary variable
    void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

public:
    // Selection Sort algorithm using standard loops and raw arrays
    void sort(int arr[], int n) {
        // Move boundary of unsorted subarray one by one
        for (int i = 0; i < n - 1; i++) {
            // Find the minimum element in unsorted array [i .. n-1]
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            // Swap the found minimum element with the first element of unsorted part
            if (minIndex != i) {
                swap(arr[i], arr[minIndex]);
            }
        }
    }

    // Function to display the contents of the array
    void printArray(int arr[], int n) {
        for (int i = 0; i < n; i++) {
            std::cout << arr[i] << " ";
        }
        std::cout << "\n";
    }
};

int main() {
    std::cout << "--- Selection Sort Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    int arr[] = {64, 25, 12, 22, 11};
    int n = sizeof(arr) / sizeof(arr[0]);

    SelectionSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
