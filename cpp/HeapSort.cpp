// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Heap Sort Implementation Using Class (Binary Max-Heap)
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class HeapSort {
private:
    // Basic function to swap two elements using temporary variable
    void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // Function to maintain the MAX-HEAP property:
    // A Max-Heap ensures that parent node is always >= its children.
    // arr[]: array representation of binary heap
    // n: size of current heap
    // i: index of root of subtree
    void maxHeapify(int arr[], int n, int i) {
        int largest = i;       // Initialize largest as root
        int left = 2 * i + 1;  // Left child in 0-indexed array
        int right = 2 * i + 2; // Right child in 0-indexed array

        // Check if left child is larger than current largest
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // Check if right child is larger than current largest
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root, swap and recursively heapify affected sub-tree
        if (largest != i) {
            swap(arr[i], arr[largest]);
            maxHeapify(arr, n, largest);
        }
    }

public:
    // Main function to perform Heap Sort using Max-Heap
    void sort(int arr[], int n) {
        // Step 1: Build MAX-HEAP from input array
        // Last non-leaf node is at index (n / 2 - 1)
        for (int i = n / 2 - 1; i >= 0; i--) {
            maxHeapify(arr, n, i);
        }

        // Step 2: One by one extract the maximum element (root) from the heap
        for (int i = n - 1; i > 0; i--) {
            // Swap current root (maximum element in max-heap) to the end of array
            swap(arr[0], arr[i]);

            // Call maxHeapify on reduced heap of size i to restore max-heap property
            maxHeapify(arr, i, 0);
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
    std::cout << "--- Heap Sort (Max-Heap) Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    int arr[] = {12, 11, 13, 5, 6, 7};
    int n = sizeof(arr) / sizeof(arr[0]);

    HeapSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
