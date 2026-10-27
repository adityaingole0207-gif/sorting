// ============================================================================
// Academic Project: Data Structures & Algorithms (DSA)
// Topic: Merge Sort Implementation Using Class
// 
// Project Authors:
//   1. Aditya Ingole   (Roll No. CS2301)
//   2. Ashutosh Tiwari (Roll No. CS2303)
//   3. Keshav Bhutada  (Roll No. CS2304)
//   4. Rupesh Chauhan  (Roll No. CS2308)
// ============================================================================

#include <iostream>

class MergeSort {
private:
    // Helper function to merge two sorted subarrays: arr[left..mid] and arr[mid+1..right]
    void merge(int arr[], int left, int mid, int right) {
        int n1 = mid - left + 1; // Size of left subarray
        int n2 = right - mid;    // Size of right subarray

        // Allocate basic dynamic arrays for temporary subarrays
        int* L = new int[n1];
        int* R = new int[n2];

        // Copy data into temporary subarrays L[] and R[]
        for (int i = 0; i < n1; i++) {
            L[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            R[j] = arr[mid + 1 + j];
        }

        // Merge the temporary arrays back into arr[left..right]
        int i = 0;    // Initial index of first subarray
        int j = 0;    // Initial index of second subarray
        int k = left; // Initial index of merged subarray

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        // Copy remaining elements of L[], if any
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        // Copy remaining elements of R[], if any
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }

        // Free allocated memory
        delete[] L;
        delete[] R;
    }

    // Recursive helper function for Divide and Conquer
    void divideAndMerge(int arr[], int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;

            // Sort first and second halves
            divideAndMerge(arr, left, mid);
            divideAndMerge(arr, mid + 1, right);

            // Merge the sorted halves
            merge(arr, left, mid, right);
        }
    }

public:
    // Public sort method called with array and size
    void sort(int arr[], int n) {
        if (n > 1) {
            divideAndMerge(arr, 0, n - 1);
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
    std::cout << "--- Merge Sort Demonstration ---\n";
    std::cout << "Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan\n\n";

    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = sizeof(arr) / sizeof(arr[0]);

    MergeSort sorter;

    std::cout << "Original Array: ";
    sorter.printArray(arr, n);

    sorter.sort(arr, n);

    std::cout << "Sorted Array:   ";
    sorter.printArray(arr, n);

    return 0;
}
