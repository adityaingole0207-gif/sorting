@echo off
REM ===========================================================================
REM SortLab: Compile All Individual C++ Sorting Classes
REM Authors: Aditya Ingole, Ashutosh Tiwari, Keshav Bhutada, Rupesh Chauhan
REM ===========================================================================

echo Compiling all individual C++ sorting files...
g++ -std=c++17 -Wall -Wextra BubbleSort.cpp -o BubbleSort.exe
g++ -std=c++17 -Wall -Wextra SelectionSort.cpp -o SelectionSort.exe
g++ -std=c++17 -Wall -Wextra InsertionSort.cpp -o InsertionSort.exe
g++ -std=c++17 -Wall -Wextra MergeSort.cpp -o MergeSort.exe
g++ -std=c++17 -Wall -Wextra QuickSort.cpp -o QuickSort.exe
g++ -std=c++17 -Wall -Wextra HeapSort.cpp -o HeapSort.exe
g++ -std=c++17 -Wall -Wextra AdaptiveSort.cpp -o AdaptiveSort.exe

echo All individual sorting executables compiled successfully!
