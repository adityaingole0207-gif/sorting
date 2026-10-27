// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Quick Sort Implementation Using Class (Lomuto Partition)
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class QuickSort {
private:
    // Helper function to swap two numbers
    void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // Partition function: takes last element as pivot, places pivot at its
    // correct sorted position, and places all smaller elements to its left
    // and all greater elements to its right.
    int partition(int arr[], int low, int high) {
        int pivot = arr[high]; // Last element as pivot
        int i = low - 1;       // Index of smaller element

        for (int j = low; j < high; j++) {
            // If current element is smaller than or equal to pivot
            if (arr[j] <= pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        // Place pivot at its final position
        swap(arr[i + 1], arr[high]);
        return i + 1;
    }

    // Recursive helper function for Quick Sort
    void quickSortRecursive(int arr[], int low, int high) {
        if (low < high) {
            // pi is partitioning index, arr[pi] is now at right place
            int pi = partition(arr, low, high);

            // Recursively sort elements before and after partition
            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        }
    }

public:
    // Public sort method called with array and size
    void sort(int arr[], int n) {
        if (n > 1) {
            quickSortRecursive(arr, 0, n - 1);
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
    std::cout << "--- Quick Sort Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    int arr[] = {10, 80, 30, 90, 40, 50, 70};
    int n = sizeof(arr) / sizeof(arr[0]);

    QuickSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
