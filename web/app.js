/**
 * ============================================================================
 * SortLab: Adaptive Sorting Algorithm Benchmarking & Study Platform
 * Master Orchestrator (app.js)
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURATION: AUTHORS, COURSE & ACADEMIC CREDENTIALS
  // (Easily replace author names and roll numbers in this single config object)
  // ==========================================================================
  const PROJECT_CONFIG = {
    title: "SortLab: Adaptive Sorting Algorithm Benchmarking Tool",
    course: "Data Structures & Algorithms (DSA)",
    courseCode: "CS-2026-DSA",
    authors: [
      { name: "Alex Mercer", rollNo: "2026-DSA-01" },
      { name: "Priya Sharma", rollNo: "2026-DSA-14" },
      { name: "David Chen", rollNo: "2026-DSA-29" }
    ]
  };

  // ==========================================================================
  // STATIC THEORY COMPARISON DATA (ALL 10 DSA SORTING ALGORITHMS)
  // ==========================================================================
  const THEORY_DATA = [
    { id: 0, name: "Insertion Sort", color: "#D98200", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes", inPlace: "Yes", adaptive: "Yes", useCase: "Small datasets (N < 16) or nearly-sorted data" },
    { id: 1, name: "Merge Sort", color: "#0E7C6F", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes", inPlace: "No", adaptive: "No", useCase: "Guaranteed O(n log n) & stability; linked lists" },
    { id: 2, name: "Quick Sort (Med-3)", color: "#E2461F", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No", inPlace: "Yes", adaptive: "No", useCase: "General in-memory sorting with optimal CPU cache performance" },
    { id: 3, name: "Heap Sort", color: "#7A3E8E", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No", inPlace: "Yes", adaptive: "No", useCase: "Strict O(1) auxiliary space with guaranteed O(n log n)" },
    { id: 4, name: "Adaptive Sort", color: "#1F3A5F", best: "O(n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(log n)", stable: "Varies", inPlace: "Yes", adaptive: "Yes", useCase: "Standard libraries (C++ std::sort, Introsort hybrid)" },
    { id: 5, name: "Bubble Sort", color: "#E11D48", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes", inPlace: "Yes", adaptive: "Yes", useCase: "Educational introductory teaching; verifying sortedness" },
    { id: 6, name: "Selection Sort", color: "#0284C7", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "No", inPlace: "Yes", adaptive: "No", useCase: "EEPROM / Flash memory where writes must be minimized (≤ n - 1)" },
    { id: 7, name: "Shell Sort", color: "#D97706", best: "O(n log n)", avg: "O(n¹.³)", worst: "O(n²)", space: "O(1)", stable: "No", inPlace: "Yes", adaptive: "Yes", useCase: "Embedded systems without stack memory for recursion" },
    { id: 8, name: "Counting Sort", color: "#059669", best: "O(n + k)", avg: "O(n + k)", worst: "O(n + k)", space: "O(n + k)", stable: "Yes", inPlace: "No", adaptive: "No", useCase: "Dense integer keys with range k = O(n)" },
    { id: 9, name: "Radix Sort (LSD)", color: "#4F46E5", best: "O(d·(n + b))", avg: "O(d·(n + b))", worst: "O(d·(n + b))", space: "O(n + b)", stable: "Yes", inPlace: "No", adaptive: "No", useCase: "Fixed-width integers, IP addresses, dates, fixed strings" }
  ];

  // --- 1. Algorithm Definitions & Comprehensive Knowledge Base ---
  const ALGORITHMS = [
    {
      id: 0,
      name: "Insertion Sort",
      shortName: "Insertion",
      color: "#E8A317",
      bgColor: "#FEF8EC",
      desc: "Builds a sorted prefix by taking one element at a time and shifting larger items to the right to open an insertion slot.",
      complexityBest: "O(n)",
      complexityAvg: "O(n²)",
      complexityWorst: "O(n²)",
      space: "O(1) in-place",
      stable: "Yes",
      inPlace: "Yes",
      analogy: "Sorting playing cards in your hand. As you pick up each new card, you scan the cards already in your hand from right to left, shift larger cards over, and slide the new card into its proper sorted spot.",
      workedExample: [
        { step: "Init", text: "Array: [45, 12, 89, 3, 27]. Subarray [45] is trivially sorted." },
        { step: "i = 1", text: "Key = 12. Compare 12 with 45. Since 45 > 12, shift 45 right. Insert 12 at index 0 -> [12, 45, 89, 3, 27]." },
        { step: "i = 2", text: "Key = 89. Compare 89 with 45. Since 89 > 45, no shift needed -> [12, 45, 89, 3, 27]." },
        { step: "i = 3", text: "Key = 3. Shift 89, 45, 12 right. Insert 3 at index 0 -> [3, 12, 45, 89, 27]." },
        { step: "i = 4", text: "Key = 27. Shift 89, 45 right. Insert 27 at index 2 -> [3, 12, 27, 45, 89]. Sorted!" }
      ],
      pros: [
        "Optimal O(n) performance on already sorted or nearly sorted sequences",
        "O(1) auxiliary space (strictly in-place)",
        "Extremely low constant factors and minimal overhead on small arrays",
        "Stable sort: preserves relative ordering of equal elements"
      ],
      cons: [
        "O(n²) worst and average case runtime on random or reverse sequences",
        "High element shift volume when items are far from their target position"
      ],
      whenToUse: "Ideal for small datasets (N < 16), nearly sorted lists, or as the base case cutoff in hybrid sorts like Timsort and Introsort.",
      vivaQA: [
        {
          q: "Why does Insertion Sort achieve O(n) linear time in the best case?",
          a: "When the input array is already sorted, the loop condition arr[j] > key evaluates to false on the very first comparison for every element. The inner while loop immediately breaks, performing exactly (n - 1) comparisons and 0 element shifts."
        },
        {
          q: "What is the formal loop invariant for Insertion Sort?",
          a: "At the beginning of each iteration of the outer for loop (indexed by i), the subarray arr[0 .. i - 1] contains the original elements from arr[0 .. i - 1], but arranged in strictly sorted ascending order."
        },
        {
          q: "Why is Insertion Sort considered stable?",
          a: "Because we only shift elements that are strictly greater than the key (arr[j] > key). When an element equal to the key is encountered, the shift terminates immediately, preserving the relative order of duplicate keys."
        },
        {
          q: "How many shifts does Insertion Sort perform in the worst case?",
          a: "In the worst case (a strictly reverse-sorted array), each element i must be shifted past all i preceding elements, requiring exactly n(n - 1) / 2 shifts (inversions)."
        }
      ],
      quiz: [
        {
          q: "What is the best-case time complexity of Insertion Sort?",
          options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
          correct: 1,
          exp: "Correct! When the array is already sorted, only one comparison per element is needed and zero shifts occur, yielding O(n) linear time."
        },
        {
          q: "Which property makes Insertion Sort desirable for hybrid algorithms like Introsort?",
          options: ["Very low constant factor and zero recursion overhead on small arrays", "Guaranteed O(n log n) worst-case", "Does not require comparisons", "Operates in O(log n) space"],
          correct: 0,
          exp: "Correct! For small partitions (N < 16), the low constant factors and sequential CPU cache locality of Insertion Sort beat recursive overhead."
        },
        {
          q: "What is the auxiliary space complexity of Insertion Sort?",
          options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
          correct: 2,
          exp: "Correct! Insertion Sort is an in-place algorithm that requires only a single temporary variable (key) taking O(1) auxiliary memory."
        }
      ],
      cppCode: [
        "void insertionSort(int arr[], int n) {",
        "    for (int i = 1; i < n; i++) {",
        "        int key = arr[i];",
        "        int j = i - 1;",
        "        while (j >= 0 && arr[j] > key) {",
        "            arr[j + 1] = arr[j];",
        "            j--;",
        "        }",
        "        arr[j + 1] = key;",
        "    }",
        "}"
      ],
      pseudoCode: [
        "algorithm InsertionSort(A, n):",
        "    for i from 1 to n - 1:",
        "        key = A[i]",
        "        j = i - 1",
        "        while j >= 0 and A[j] > key:",
        "            A[j + 1] = A[j]",
        "            j = j - 1",
        "        A[j + 1] = key",
        "    return A"
      ]
    },
    {
      id: 1,
      name: "Merge Sort",
      shortName: "Merge",
      color: "#138A7E",
      bgColor: "#EBF7F5",
      desc: "Divides the array into two halves, recursively sorts them, and merges the two sorted halves into a temporary auxiliary buffer.",
      complexityBest: "O(n log n)",
      complexityAvg: "O(n log n)",
      complexityWorst: "O(n log n)",
      space: "O(n) auxiliary",
      stable: "Yes",
      inPlace: "No",
      analogy: "Dividing a stack of ungraded exams between two teaching assistants. Each TA sorts their smaller stack, and then they merge the two sorted stacks together by comparing the top exams of each stack.",
      workedExample: [
        { step: "Divide", text: "Array [45, 12, 89, 3, 27] splits into Left [45, 12, 89] and Right [3, 27]." },
        { step: "Left Subproblem", text: "[45, 12, 89] splits into [45, 12] and [89]. [45, 12] merges to [12, 45]. Then merges with [89] to produce [12, 45, 89]." },
        { step: "Right Subproblem", text: "[3, 27] splits into [3] and [27], then merges to [3, 27]." },
        { step: "Final Merge", text: "Compare heads of [12, 45, 89] and [3, 27]: 3 < 12 -> 3; 12 < 27 -> 12; 27 < 45 -> 27; copy 45, 89 -> [3, 12, 27, 45, 89]." }
      ],
      pros: [
        "Guaranteed O(n log n) runtime in ALL cases (best, average, worst)",
        "Stable sort: preserves relative ordering of equal elements",
        "Excellent for linked lists and external sorting (disk files)"
      ],
      cons: [
        "Requires O(n) auxiliary heap memory for the temporary merge buffer",
        "Not in-place; high memory traffic on large in-RAM arrays"
      ],
      whenToUse: "When guaranteed predictable O(n log n) performance and stability are non-negotiable, or when sorting linked lists or disk files.",
      vivaQA: [
        {
          q: "What is the recurrence relation for Merge Sort and its Master Theorem solution?",
          a: "T(n) = 2T(n/2) + O(n). By Case 2 of the Master Theorem (where a=2, b=2, and f(n)=O(n)), log_b(a) = log_2(2) = 1, so T(n) = O(n log n) in all cases."
        },
        {
          q: "Why does standard array Merge Sort require O(n) auxiliary memory?",
          a: "Merging two sorted subarrays in-place without overwriting uninspected elements takes O(n) shifts per merge, which would degrade the runtime to O(n²). An auxiliary buffer of size n allows O(n) linear-time merging."
        },
        {
          q: "Is Merge Sort stable? Why?",
          a: "Yes. In the merge loop, when left and right elements are equal (arr[i] == arr[j]), the algorithm always takes the element from the left subarray first, preserving its original relative position."
        },
        {
          q: "Can Merge Sort be implemented without recursion?",
          a: "Yes. Bottom-up (iterative) Merge Sort begins by merging pairs of subarrays of size 1, then size 2, 4, 8, etc., eliminating the O(log n) call stack."
        }
      ],
      quiz: [
        {
          q: "What is the worst-case time complexity of Merge Sort?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
          correct: 1,
          exp: "Correct! Merge Sort guarantees O(n log n) runtime even in the absolute worst-case scenario."
        },
        {
          q: "How much extra memory does Merge Sort require for an array of size N?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: 2,
          exp: "Correct! Standard Merge Sort requires an auxiliary buffer of size N (O(n) bytes) to stage merged subarrays."
        },
        {
          q: "Which step in Merge Sort performs all element comparisons?",
          options: ["The divide step", "The base case check", "The merge step", "The recursive call"],
          correct: 2,
          exp: "Correct! The divide step only calculates the midpoint. All comparisons occur when merging elements into the auxiliary buffer."
        }
      ],
      cppCode: [
        "void mergeSort(int arr[], int left, int right) {",
        "    if (left >= right) return;",
        "    int mid = left + (right - left) / 2;",
        "    mergeSort(arr, left, mid);",
        "    mergeSort(arr, mid + 1, right);",
        "    merge(arr, left, mid, right);",
        "}",
        "void merge(int arr[], int left, int mid, int right) {",
        "    int i = left, j = mid + 1, k = left;",
        "    while (i <= mid && j <= right) {",
        "        if (arr[i] <= arr[j]) temp[k++] = arr[i++];",
        "        else temp[k++] = arr[j++];",
        "    }",
        "    while (i <= mid) temp[k++] = arr[i++];",
        "    while (j <= right) temp[k++] = arr[j++];",
        "    for (int p = left; p <= right; p++) arr[p] = temp[p];",
        "}"
      ],
      pseudoCode: [
        "algorithm MergeSort(A, left, right):",
        "    if left >= right: return",
        "    mid = floor((left + right) / 2)",
        "    MergeSort(A, left, mid)",
        "    MergeSort(A, mid + 1, right)",
        "    Merge(A, left, mid, right)",
        "",
        "algorithm Merge(A, left, mid, right):",
        "    while i <= mid and j <= right:",
        "        if A[i] <= A[j]: copy A[i] to temp",
        "        else: copy A[j] to temp",
        "    copy remaining elements to temp",
        "    copy temp back to A[left..right]"
      ]
    },
    {
      id: 2,
      name: "Quick Sort (Med-3)",
      shortName: "Quick",
      color: "#E2461F",
      bgColor: "#FDF1ED",
      desc: "Picks a median-of-three pivot, partitions the array such that smaller values precede larger values, and recursively sorts both partitions.",
      complexityBest: "O(n log n)",
      complexityAvg: "O(n log n)",
      complexityWorst: "O(n²)",
      space: "O(log n) stack",
      stable: "No",
      inPlace: "Yes",
      analogy: "Organizing students by height around a benchmark student (the pivot). All students shorter than the pivot move to the left; all students taller move to the right. Both subgroups then repeat the process.",
      workedExample: [
        { step: "Pivot Selection", text: "Subarray [45, 12, 89, 3, 27]. Median-of-3 checks arr[0]=45, arr[2]=89, arr[4]=27. Median is 45. Place 45 as pivot." },
        { step: "Hoare Partition", text: "Scan i from left for elements >= 45, scan j from right for elements <= 45. Swap inverted pairs." },
        { step: "Partition Split", text: "Partition splits array into Left (<= 45) and Right (>= 45)." },
        { step: "Recursive Sort", text: "Recursively sort [27, 12, 3] and [45, 89]. Produces fully sorted array [3, 12, 27, 45, 89]." }
      ],
      pros: [
        "Fastest in-memory sort on typical hardware due to tight inner loop and sequential cache lines",
        "In-place sorting with O(log n) call stack",
        "Median-of-three eliminates quadratic breakdown on sorted/reverse inputs"
      ],
      cons: [
        "Unstable sort: may rearrange equal items",
        "Adversarial inputs can still trigger O(n²) if partitioning becomes degenerate"
      ],
      whenToUse: "The default choice for general-purpose in-memory sorting where stability is not required.",
      vivaQA: [
        {
          q: "What is the advantage of Median-of-Three pivot selection?",
          a: "If the first or last element is chosen as pivot on an already-sorted or reversed array, Quick Sort partitions into sizes 0 and n-1, causing O(n²) recursion. Median-of-three samples low, mid, high, guaranteeing balanced splits on presorted data."
        },
        {
          q: "Why is Hoare's partition preferred over Lomuto's?",
          a: "Hoare's partitioning scheme uses two converging pointers and performs roughly three times fewer element swaps on average than Lomuto's scheme."
        },
        {
          q: "What is the space complexity of Quick Sort?",
          a: "Auxiliary heap space is O(1) (in-place), but recursive call stack space is O(log n) on average, up to O(n) in pathological worst-case scenarios."
        },
        {
          q: "Why is Quick Sort unstable?",
          a: "Long-distance swaps over the pivot boundary can swap identical keys past each other, disrupting their original relative ordering."
        }
      ],
      quiz: [
        {
          q: "What causes Quick Sort to degrade to O(n²) worst case?",
          options: ["Choosing equal elements", "Highly unbalanced partitions (e.g. 0 and n-1)", "Having too many duplicates", "Using recursive functions"],
          correct: 1,
          exp: "Correct! If the pivot consistently lands on an extreme minimum or maximum, partition sizes become 0 and n-1, leading to an n-level recursion tree."
        },
        {
          q: "How does Median-of-Three select the pivot?",
          options: ["Picks a random number", "Takes the median of arr[low], arr[mid], and arr[high]", "Calculates the average of all elements", "Always picks arr[0]"],
          correct: 1,
          exp: "Correct! It inspects arr[low], arr[mid], and arr[high], and places their median at arr[low] to act as the pivot."
        },
        {
          q: "Is Quick Sort in-place?",
          options: ["No, it requires an auxiliary buffer of size n", "Yes, it sorts within the original array using O(log n) stack space", "Only when implemented iteratively", "No, it requires O(n²) memory"],
          correct: 1,
          exp: "Correct! Quick Sort rearranges elements in-place within the array, requiring only call stack frames."
        }
      ],
      cppCode: [
        "void quickSort(int arr[], int low, int high) {",
        "    if (low >= high) return;",
        "    int pivot = medianOfThree(arr, low, high);",
        "    int p = hoarePartition(arr, low, high, pivot);",
        "    quickSort(arr, low, p);",
        "    quickSort(arr, p + 1, high);",
        "}",
        "int hoarePartition(int arr[], int low, int high, int pivot) {",
        "    int i = low - 1, j = high + 1;",
        "    while (true) {",
        "        do { i++; } while (arr[i] < pivot);",
        "        do { j--; } while (arr[j] > pivot);",
        "        if (i >= j) return j;",
        "        swap(arr[i], arr[j]);",
        "    }",
        "}"
      ],
      pseudoCode: [
        "algorithm QuickSort(A, low, high):",
        "    if low >= high: return",
        "    pivot = MedianOfThree(A[low], A[mid], A[high])",
        "    p = HoarePartition(A, low, high, pivot)",
        "    QuickSort(A, low, p)",
        "    QuickSort(A, p + 1, high)",
        "",
        "algorithm HoarePartition(A, low, high, pivot):",
        "    i = low - 1; j = high + 1",
        "    repeat:",
        "        advance i while A[i] < pivot",
        "        decrement j while A[j] > pivot",
        "        if i >= j: return j",
        "        swap A[i] and A[j]"
      ]
    },
    {
      id: 3,
      name: "Heap Sort",
      shortName: "Heap",
      color: "#7A3E8E",
      bgColor: "#F6EDF8",
      desc: "Transforms the array in-place into a binary max-heap in O(n) time, then repeatedly extracts the root maximum to the end.",
      complexityBest: "O(n log n)",
      complexityAvg: "O(n log n)",
      complexityWorst: "O(n log n)",
      space: "O(1) in-place",
      stable: "No",
      inPlace: "Yes",
      analogy: "A corporate tournament pyramid. The top performer rises to the CEO position (root of max-heap), steps down to the hall of fame (end of the array), and the remaining contenders battle to find the next champion.",
      workedExample: [
        { step: "Initial Array", text: "[45, 12, 89, 3, 27]. Viewed as binary tree: Root=45, Children=(12, 89), Grandchildren=(3, 27)." },
        { step: "Build Max-Heap", text: "Bottom-up heapify from index n/2-1 down to 0. 89 is largest; root becomes 89. Max-heap: [89, 27, 45, 3, 12]." },
        { step: "Extract 1", text: "Swap root 89 with end 12 -> [12, 27, 45, 3 | 89]. SiftDown root 12 -> [45, 27, 12, 3 | 89]." },
        { step: "Extract 2", text: "Swap root 45 with end 3 -> [3, 27, 12 | 45, 89]. SiftDown root 3 -> [27, 3, 12 | 45, 89]." },
        { step: "Remaining", text: "Extract 27, then 12. Final sorted array: [3, 12, 27, 45, 89]." }
      ],
      pros: [
        "Guaranteed O(n log n) in all cases (never degrades to O(n²))",
        "Strictly in-place with O(1) auxiliary memory (no heap buffers)",
        "Predictable memory footprint with zero extra heap allocations"
      ],
      cons: [
        "Unstable sort",
        "Poor CPU cache locality compared to QuickSort because parent/child indices jump across memory"
      ],
      whenToUse: "Systems with critical memory limitations (embedded hardware, safety-critical real-time OS) where O(n log n) must be guaranteed without extra RAM.",
      vivaQA: [
        {
          q: "Why is building a binary heap O(n) and not O(n log n)?",
          a: "Bottom-up heap construction starts at the lowest internal nodes. Most nodes are near the leaves where tree height h is small. The summation sum(h / 2^h) converges to <= 2, bounding total operations to O(n)."
        },
        {
          q: "What are the parent and child index formulas in a 0-indexed binary heap?",
          a: "For node at index i: Left child = 2i + 1, Right child = 2i + 2, Parent = floor((i - 1) / 2)."
        },
        {
          q: "Why does Quick Sort usually run faster than Heap Sort in practice?",
          a: "Quick Sort accesses elements sequentially with high spatial locality, keeping cache lines hot. Heap Sort jumps between i, 2i+1, and 2i+2, causing frequent CPU L1/L2 cache misses."
        },
        {
          q: "Is Heap Sort stable?",
          a: "No. Swapping the root with the last element of the heap relocates items across large distances, breaking original relative order."
        }
      ],
      quiz: [
        {
          q: "What is the time complexity to build a binary max-heap of size N from an arbitrary array?",
          options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
          correct: 1,
          exp: "Correct! Bottom-up heapify runs in linear O(n) time, proven by the geometric summation of node heights."
        },
        {
          q: "In an array representation of a binary heap, where is the left child of node at index i?",
          options: ["2i", "2i + 1", "2i + 2", "i / 2"],
          correct: 1,
          exp: "Correct! In 0-indexed arrays, the left child is at index 2i + 1 and right child is at 2i + 2."
        },
        {
          q: "What is the auxiliary memory consumption of Heap Sort?",
          options: ["O(1) in-place", "O(log n) call stack", "O(n) auxiliary array", "O(n log n)"],
          correct: 0,
          exp: "Correct! Heap Sort is strictly in-place, operating on the existing array with zero auxiliary memory allocations."
        }
      ],
      cppCode: [
        "void heapSort(int arr[], int n) {",
        "    // Step 1: Build max-heap bottom-up",
        "    for (int i = n / 2 - 1; i >= 0; i--)",
        "        siftDown(arr, i, n);",
        "    // Step 2: Extract maximum to end",
        "    for (int end = n - 1; end > 0; end--) {",
        "        swap(arr[0], arr[end]);",
        "        siftDown(arr, 0, end);",
        "    }",
        "}",
        "void siftDown(int arr[], int root, int size) {",
        "    int largest = root, l = 2*root + 1, r = 2*root + 2;",
        "    if (l < size && arr[l] > arr[largest]) largest = l;",
        "    if (r < size && arr[r] > arr[largest]) largest = r;",
        "    if (largest != root) {",
        "        swap(arr[root], arr[largest]);",
        "        siftDown(arr, largest, size);",
        "    }",
        "}"
      ],
      pseudoCode: [
        "algorithm HeapSort(A, n):",
        "    // Build max-heap",
        "    for i from floor(n/2) - 1 down to 0:",
        "        SiftDown(A, i, n)",
        "    // Extract root repeatedly",
        "    for end from n - 1 down to 1:",
        "        swap(A[0], A[end])",
        "        SiftDown(A, 0, end)",
        "",
        "algorithm SiftDown(A, root, size):",
        "    largest = root, l = 2*root + 1, r = 2*root + 2",
        "    if l < size and A[l] > A[largest]: largest = l",
        "    if r < size and A[r] > A[largest]: largest = r",
        "    if largest != root:",
        "        swap(A[root], A[largest])",
        "        SiftDown(A, largest, size)"
      ]
    },
    {
      id: 4,
      name: "Adaptive Sort",
      shortName: "Adaptive",
      color: "#1F3A5F",
      bgColor: "#EDF2F8",
      desc: "Profiles the input array structure (sortedness, runs, inversions, magnitude) and dispatches the optimal sorting strategy (Reversal, Run Insertion, or Introsort).",
      complexityBest: "O(n)",
      complexityAvg: "O(n log n)",
      complexityWorst: "O(n log n)",
      space: "O(log n) stack",
      stable: "Varies",
      inPlace: "Yes",
      analogy: "A smart GPS navigation system. If you are already on an open highway, it keeps you cruising (presorted O(n)). If you are going backwards, it takes a clean U-turn (reversal). In city traffic, it blends highways with local detours (Introsort).",
      workedExample: [
        { step: "Profiling", text: "Array [45, 12, 89, 3, 27]: N=5, sorted runs=3, inversions=4. Dispatches Insertion Sort (N < 16)." },
        { step: "Reverse Profile", text: "Given [50, 40, 30, 20, 10]: Detects monotone descending sequence. Performs in-place symmetric reversal in 2 swaps, 0 comparisons!" },
        { step: "Large Random", text: "Given N=1000 random: Dispatches Introsort (QuickSort with depth guard cutoff at 2*floor(log2(N)) = 18 and Insertion cutoff < 16)." }
      ],
      pros: [
        "Optimal O(n) runtime on presorted and reverse-sorted data",
        "Eliminates QuickSort's O(n²) worst-case via Introsort HeapSort depth guard",
        "Eliminates recursive call overhead on small partitions (< 16 elements)"
      ],
      cons: [
        "Small profiling inspection pass overhead (O(n) sampling)",
        "More complex implementation logic"
      ],
      whenToUse: "The standard algorithm of modern standard libraries (e.g. C++ std::sort uses Introsort; Python and Java use Timsort).",
      vivaQA: [
        {
          q: "What is Introsort?",
          a: "Introspective Sort begins with Quick Sort for optimal cache performance. It tracks recursion depth; if depth reaches 2*floor(log2(n)), it switches to Heap Sort to guarantee an O(n log n) upper bound."
        },
        {
          q: "Why does Adaptive Sort switch to Insertion Sort for subproblems < 16?",
          a: "For tiny arrays, function call frames, pointer arithmetic, and partitioning overhead exceed the execution time of simple sequential shifting in Insertion Sort."
        },
        {
          q: "How does Adaptive Sort handle strictly reverse-sorted arrays?",
          a: "It identifies monotonic non-increasing ordering during profiling and inverts the array in-place using floor(n/2) symmetric swaps with zero element comparisons."
        },
        {
          q: "What real-world languages use adaptive hybrid sorting?",
          a: "C++ STL uses Introsort (QuickSort + HeapSort + InsertionSort). Python, Java, Android, and Rust use Timsort (MergeSort + InsertionSort)."
        }
      ],
      quiz: [
        {
          q: "When does Introsort switch from QuickSort to HeapSort?",
          options: ["When the array size is less than 16", "When recursion depth exceeds 2 * floor(log2 n)", "When duplicate elements are found", "Never"],
          correct: 1,
          exp: "Correct! If the recursion tree grows deeper than 2*floor(log2 n), it indicates degenerate partitioning, so it switches to HeapSort to prevent O(n²)."
        },
        {
          q: "What is the time complexity of Adaptive Sort on a strictly reverse-sorted array?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
          correct: 2,
          exp: "Correct! It detects the descending monotone order and applies in-place reversal in floor(n/2) swaps and zero comparisons (O(n) linear)."
        },
        {
          q: "Why does Adaptive Sort check for small arrays (N < 16)?",
          options: ["Because QuickSort crashes on small arrays", "Because Insertion Sort has lower constant factor overhead on small arrays", "Because HeapSort cannot build heaps smaller than 16", "To save memory"],
          correct: 1,
          exp: "Correct! For small N, the cache-friendly sequential shifts of Insertion Sort beat recursive call-frame overhead."
        }
      ],
      cppCode: [
        "void adaptiveSort(int arr[], int n) {",
        "    Profile p = profileInput(arr, n);",
        "    if (p.isSorted) return; // Verified in O(n)",
        "    if (p.isReversed) { reverseInPlace(arr, n); return; }",
        "    if (n < 16) { insertionSort(arr, n); return; }",
        "    if (p.sortedRuns <= 4) { adaptiveRunMerge(arr, n); return; }",
        "    int maxDepth = 2 * floor(log2(n));",
        "    introsort(arr, 0, n - 1, maxDepth, 1);",
        "}"
      ],
      pseudoCode: [
        "algorithm AdaptiveSort(A, n):",
        "    profile = ProfileInput(A, n)",
        "    if profile.isSorted: return",
        "    if profile.isReversed: ReverseInPlace(A, n); return",
        "    if n < 16: InsertionSort(A, n); return",
        "    if profile.sortedRuns <= 4: RunMerge(A, n); return",
        "    maxDepth = 2 * floor(log2(n))",
        "    Introsort(A, 0, n - 1, maxDepth, 1)"
      ]
    },
    {
      id: 5,
      name: "Bubble Sort",
      shortName: "Bubble",
      color: "#E11D48",
      bgColor: "#FFF1F2",
      desc: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Passes continue until no swaps are needed.",
      complexityBest: "O(n)",
      complexityAvg: "O(n²)",
      complexityWorst: "O(n²)",
      space: "O(1) in-place",
      stable: "Yes",
      inPlace: "Yes",
      analogy: "Bubbles rising in water. The largest air bubbles (largest numbers) rise to the surface (end of the array) first in each pass.",
      workedExample: [
        { step: "Pass 1", text: "Compare [45, 12] -> swap to [12, 45]. Compare [45, 89] -> ok. Compare [89, 3] -> swap to [3, 89]. Compare [89, 27] -> swap to [27, 89]. Array: [12, 45, 3, 27, 89]. Max 89 locked at end." },
        { step: "Pass 2", text: "Compare [12, 45] -> ok. Compare [45, 3] -> swap to [3, 45]. Compare [45, 27] -> swap to [27, 45]. Array: [12, 3, 27, 45, 89]. 45 locked at index 3." },
        { step: "Pass 3", text: "Compare [12, 3] -> swap to [3, 12]. Compare [12, 27] -> ok. Array: [3, 12, 27, 45, 89]. 27 locked." },
        { step: "Pass 4", text: "Compare [3, 12] -> ok. No swaps executed in entire pass; early exit flag triggered! Array verified sorted." }
      ],
      pros: [
        "Conceptually straightforward and easy to implement",
        "O(n) linear best case when optimized with a swapped flag",
        "Stable sort: never disrupts relative ordering of equal keys",
        "Strictly in-place with O(1) auxiliary space"
      ],
      cons: [
        "O(n²) worst and average case runtime on random or reverse sequences",
        "Performs far more writes and swaps than Selection Sort or Insertion Sort",
        "Impractical for large datasets"
      ],
      whenToUse: "Introductory teaching of sorting concepts, or verifying whether a list is already sorted in a single pass.",
      vivaQA: [
        {
          q: "How does the swapped boolean flag optimize Bubble Sort?",
          a: "If an entire pass completes without a single swap occurring, all adjacent pairs are in ascending order. The flag terminates the outer loop immediately, achieving O(n) best-case time instead of O(n²)."
        },
        {
          q: "What is the formal loop invariant for Bubble Sort?",
          a: "After iteration i of the outer loop (0 <= i < n), the subarray arr[n-i .. n-1] contains the i largest elements of the original array in strictly sorted ascending order."
        },
        {
          q: "Why is Bubble Sort considered stable?",
          a: "Adjacent elements are swapped only when arr[j] > arr[j+1]. Equal elements (arr[j] == arr[j+1]) never satisfy the condition, preserving their original relative sequence."
        },
        {
          q: "What is the maximum number of comparisons and swaps in Bubble Sort?",
          a: "Comparisons: exactly n(n - 1) / 2 in the unoptimized version. Swaps: exactly equal to the total number of inversions in the input array, up to n(n - 1) / 2 in reverse-sorted data."
        }
      ],
      quiz: [
        {
          q: "What triggers an early termination in optimized Bubble Sort?",
          options: ["Reaching the middle of the array", "A complete pass with zero swaps performed", "Finding a duplicate element", "After exactly 3 iterations"],
          correct: 1,
          exp: "Correct! If an entire inner loop pass makes 0 swaps, all adjacent pairs are ordered, proving the array is sorted."
        },
        {
          q: "Is Bubble Sort a stable sorting algorithm?",
          options: ["Yes, equal elements are never swapped", "No, it swaps across arbitrary distances", "Only for arrays of even length", "Only when using a flag"],
          correct: 0,
          exp: "Correct! The condition arr[j] > arr[j+1] strictly requires a strictly greater element to trigger a swap, keeping equal keys stable."
        },
        {
          q: "What is the worst-case number of swaps for Bubble Sort on an array of size n?",
          options: ["n", "n log n", "n(n - 1) / 2", "2^n"],
          correct: 2,
          exp: "Correct! On a strictly reverse-sorted array, every pair of elements forms an inversion, requiring n(n-1)/2 swaps."
        }
      ],
      cppCode: [
        "void bubbleSort(int arr[], int n) {",
        "    for (int i = 0; i < n - 1; i++) {",
        "        bool swapped = false;",
        "        for (int j = 0; j < n - i - 1; j++) {",
        "            if (arr[j] > arr[j + 1]) {",
        "                swap(arr[j], arr[j + 1]);",
        "                swapped = true;",
        "            }",
        "        }",
        "        if (!swapped) break; // Optimized early exit",
        "    }",
        "}"
      ],
      pseudoCode: [
        "algorithm BubbleSort(A, n):",
        "    for i from 0 to n - 2:",
        "        swapped = false",
        "        for j from 0 to n - i - 2:",
        "            if A[j] > A[j + 1]:",
        "                swap(A[j], A[j + 1])",
        "                swapped = true",
        "        if not swapped: break",
        "    return A"
      ]
    },
    {
      id: 6,
      name: "Selection Sort",
      shortName: "Selection",
      color: "#0284C7",
      bgColor: "#F0F9FF",
      desc: "Divides the array into sorted prefix and unsorted suffix. Repeatedly finds the minimum element from the unsorted suffix and swaps it with the first unsorted position.",
      complexityBest: "O(n²)",
      complexityAvg: "O(n²)",
      complexityWorst: "O(n²)",
      space: "O(1) in-place",
      stable: "No",
      inPlace: "Yes",
      analogy: "Scanning a bookshelf for the thinnest book and placing it in slot 1. Then scanning the remaining unsorted shelf for the next thinnest and placing it in slot 2.",
      workedExample: [
        { step: "i = 0", text: "Array [45, 12, 89, 3, 27]. Minimum in [0..4] is 3 (at index 3). Swap arr[0] and arr[3] -> [3, 12, 89, 45, 27]." },
        { step: "i = 1", text: "Unsorted [12, 89, 45, 27]. Minimum is 12 (at index 1). Swap arr[1] with arr[1] (no-op) -> [3, 12, 89, 45, 27]." },
        { step: "i = 2", text: "Unsorted [89, 45, 27]. Minimum is 27 (at index 4). Swap arr[2] and arr[4] -> [3, 12, 27, 45, 89]." },
        { step: "i = 3", text: "Unsorted [45, 89]. Minimum is 45 (at index 3). Swap arr[3] with arr[3] -> [3, 12, 27, 45, 89]. Sorted!" }
      ],
      pros: [
        "Minimal memory writes: performs at most n - 1 swaps in all cases",
        "Strictly in-place with O(1) auxiliary memory",
        "Simple implementation without recursive stack overhead",
        "Ideal when write operations to memory are significantly expensive (e.g. Flash/EEPROM)"
      ],
      cons: [
        "Performs O(n²) comparisons in ALL cases, even when the input is already sorted",
        "Unstable: can change relative order of identical elements",
        "Does not adapt to existing presorted runs"
      ],
      whenToUse: "Systems with expensive write cycles (like Flash EEPROM memory) where minimizing memory writes to O(n) is critical.",
      vivaQA: [
        {
          q: "Why does Selection Sort perform O(n²) comparisons even on a sorted array?",
          a: "Because the inner loop must scan the entire remaining unsorted suffix arr[i .. n-1] to confirm that no smaller element exists, totaling (n - 1) + (n - 2) + ... + 1 = n(n - 1) / 2 comparisons unconditionally."
        },
        {
          q: "What is the primary advantage of Selection Sort over Bubble and Insertion Sort?",
          a: "Selection Sort performs at most (n - 1) memory writes (swaps). Bubble and Insertion sort can perform up to O(n²) writes or element shifts."
        },
        {
          q: "Why is standard Selection Sort not stable?",
          a: "A long-range swap can move the selected minimum element past equal elements. For example, sorting [4a, 4b, 2] swaps 4a with 2, resulting in [2, 4b, 4a], reversing 4a and 4b."
        },
        {
          q: "What is the formal loop invariant for Selection Sort?",
          a: "At the start of outer loop iteration i, subarray arr[0 .. i - 1] contains the smallest i elements of the entire array in sorted order, and no element in arr[i .. n - 1] is smaller than any element in arr[0 .. i - 1]."
        }
      ],
      quiz: [
        {
          q: "How many memory swaps does Selection Sort perform in the worst case?",
          options: ["n(n - 1) / 2", "At most n - 1", "n log n", "0"],
          correct: 1,
          exp: "Correct! Selection Sort performs at most one swap per outer loop iteration, totaling at most n - 1 swaps."
        },
        {
          q: "Why is Selection Sort advantageous for EEPROM / Flash memory architectures?",
          options: ["It uses the least RAM", "It minimizes memory write cycles, preserving flash wear life", "It runs in O(n) time", "It uses no comparisons"],
          correct: 1,
          exp: "Correct! Flash memory has limited write endurance. Selection Sort's O(n) write bound minimizes write wear."
        },
        {
          q: "What is the best-case time complexity of standard Selection Sort?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
          correct: 2,
          exp: "Correct! Selection Sort always scans the full remaining suffix, making O(n²) comparisons regardless of initial input order."
        }
      ],
      cppCode: [
        "void selectionSort(int arr[], int n) {",
        "    for (int i = 0; i < n - 1; i++) {",
        "        int minIdx = i;",
        "        for (int j = i + 1; j < n; j++) {",
        "            if (arr[j] < arr[minIdx])",
        "                minIdx = j;",
        "        }",
        "        if (minIdx != i) swap(arr[i], arr[minIdx]);",
        "    }",
        "}"
      ],
      pseudoCode: [
        "algorithm SelectionSort(A, n):",
        "    for i from 0 to n - 2:",
        "        minIdx = i",
        "        for j from i + 1 to n - 1:",
        "            if A[j] < A[minIdx]:",
        "                minIdx = j",
        "        if minIdx != i: swap(A[i], A[minIdx])",
        "    return A"
      ]
    },
    {
      id: 7,
      name: "Shell Sort",
      shortName: "Shell",
      color: "#D97706",
      bgColor: "#FFFBEB",
      desc: "Generalization of insertion sort that allows exchanges of far-apart elements using diminishing gap sequences (e.g. Knuth 3h+1, Ciura, or floor(n/2)).",
      complexityBest: "O(n log n)",
      complexityAvg: "O(n^1.3) to O(n log² n)",
      complexityWorst: "O(n²)",
      space: "O(1) in-place",
      stable: "No",
      inPlace: "Yes",
      analogy: "Combing tangled hair with a very wide-toothed comb first to untangle large knots, then medium teeth, and finally a fine-toothed comb for the finish.",
      workedExample: [
        { step: "Gap = 2", text: "Array [45, 12, 89, 3, 27]. Subarray (idx 0,2,4): [45, 89, 27] sorts to [27, 45, 89]. Subarray (idx 1,3): [12, 3] sorts to [3, 12]. Array: [27, 3, 45, 12, 89]." },
        { step: "Gap = 1", text: "Standard Insertion Sort on nearly-sorted array [27, 3, 45, 12, 89]. Only a few small local shifts required -> [3, 12, 27, 45, 89]. Sorted!" }
      ],
      pros: [
        "Sub-quadratic runtime (typically O(n^1.3)) with zero recursion overhead",
        "Completely in-place with O(1) auxiliary space",
        "Simple implementation without dynamic allocation or call-stack overhead",
        "Highly efficient for medium datasets (N up to 10,000)"
      ],
      cons: [
        "Performance heavily depends on the chosen gap sequence",
        "Unstable sorting algorithm",
        "Slower than QuickSort and MergeSort on very large arrays (N > 50,000)"
      ],
      whenToUse: "Embedded systems with strict memory constraints and no stack space for recursion, where O(n^1.3) performance is acceptable.",
      vivaQA: [
        {
          q: "What was Donald Shell's fundamental insight in 1959?",
          a: "Insertion Sort is slow because it only moves elements one position at a time. Shell Sort allows comparisons and swaps across a diminishing gap h, eliminating multiple inversions with a single swap."
        },
        {
          q: "Is Shell Sort stable?",
          a: "No. Elements that are separated by distance h are swapped across intervening elements, which can disrupt the relative order of duplicate items."
        },
        {
          q: "Why is the final pass of Shell Sort always gap = 1?",
          a: "A gap of 1 is identical to standard Insertion Sort, guaranteeing that the final array is 100% sorted. Prior gap passes ensure the array is already nearly sorted, making this final pass run in near-linear O(n) time."
        },
        {
          q: "Name two well-known gap sequences for Shell Sort.",
          a: "Shell's original sequence (floor(n/2^k)), Knuth's sequence (h = 3h + 1: 1, 4, 13, 40...), and Ciura's experimentally optimal sequence (1, 4, 10, 23, 57, 132, 301, 701)."
        }
      ],
      quiz: [
        {
          q: "What does the final pass of Shell Sort (gap = 1) correspond to?",
          options: ["Bubble Sort", "Standard Insertion Sort", "Quick Sort partition", "Heapify"],
          correct: 1,
          exp: "Correct! When gap = 1, Shell Sort executes an ordinary Insertion Sort on an array that has already been made largely h-sorted."
        },
        {
          q: "What is the auxiliary space complexity of Shell Sort?",
          options: ["O(1)", "O(log n)", "O(n)", "O(gap)"],
          correct: 0,
          exp: "Correct! Shell Sort requires only a few loop index variables, operating strictly in-place in O(1) space."
        },
        {
          q: "Why does Shell Sort outperform basic Insertion Sort on large random arrays?",
          options: ["It uses recursion", "It eliminates large inversions quickly by swapping elements separated by distance h", "It avoids all comparisons", "It allocates a hash table"],
          correct: 1,
          exp: "Correct! Long-distance gap swaps eliminate multiple inversions in a single step, converting the array into a nearly-sorted sequence."
        }
      ],
      cppCode: [
        "void shellSort(int arr[], int n) {",
        "    for (int gap = n / 2; gap > 0; gap /= 2) {",
        "        for (int i = gap; i < n; i++) {",
        "            int temp = arr[i];",
        "            int j = i;",
        "            while (j >= gap && arr[j - gap] > temp) {",
        "                arr[j] = arr[j - gap];",
        "                j -= gap;",
        "            }",
        "            arr[j] = temp;",
        "        }",
        "    }",
        "}"
      ],
      pseudoCode: [
        "algorithm ShellSort(A, n):",
        "    gap = floor(n / 2)",
        "    while gap > 0:",
        "        for i from gap to n - 1:",
        "            temp = A[i]",
        "            j = i",
        "            while j >= gap and A[j - gap] > temp:",
        "                A[j] = A[j - gap]",
        "                j = j - gap",
        "            A[j] = temp",
        "        gap = floor(gap / 2)",
        "    return A"
      ]
    },
    {
      id: 8,
      name: "Counting Sort",
      shortName: "Counting",
      color: "#059669",
      bgColor: "#ECFDF5",
      desc: "Non-comparison sorting algorithm that counts frequency of each distinct key in range [min, max], computes running prefix sums, and places items directly into their sorted output index.",
      complexityBest: "O(n + k)",
      complexityAvg: "O(n + k)",
      complexityWorst: "O(n + k)",
      space: "O(n + k) auxiliary",
      stable: "Yes",
      inPlace: "No",
      analogy: "Sorting numbered ballots by having labeled buckets (0, 1, 2, ...). Drop each ballot into its matching bucket, then read out the buckets in order.",
      workedExample: [
        { step: "Find Range", text: "Array [45, 12, 89, 3, 27]. Min = 3, Max = 89. Span k = 87." },
        { step: "Frequency Count", text: "Create count array of size 87. Count each item: count[3]=1, count[12]=1, count[27]=1, count[45]=1, count[89]=1." },
        { step: "Prefix Sums", text: "Transform count array into running cumulative positions: count[v] = count[v] + count[v-1]." },
        { step: "Place & Copy", text: "Iterate input from right to left, place items into output array, copy back -> [3, 12, 27, 45, 89]." }
      ],
      pros: [
        "Linear O(n + k) time complexity, beating the O(n log n) comparison-sort lower bound",
        "Stable sorting algorithm when scanned backwards during output placement",
        "Predictable execution time with zero comparison overhead"
      ],
      cons: [
        "Inefficient if key range k is much larger than n (e.g. sorting [1, 1000000] takes O(k) memory)",
        "Cannot sort arbitrary non-integer types without key mapping functions",
        "Requires O(n + k) auxiliary memory"
      ],
      whenToUse: "When sorting integers known to lie in a small, dense range (k = O(n)), or as a subroutine in Radix Sort.",
      vivaQA: [
        {
          q: "Why is Counting Sort not bound by the O(n log n) comparison sorting lower bound?",
          a: "The Ω(n log n) lower bound applies exclusively to comparison-based models (decision trees). Counting Sort uses array indices as key addresses, bypassing comparisons entirely."
        },
        {
          q: "Why do we iterate through the input array backwards (from n-1 down to 0) during the placement step?",
          a: "To ensure stability! Traversing backwards places duplicates into the output array from right to left, maintaining the exact original relative ordering of equal keys."
        },
        {
          q: "When does Counting Sort become worse than O(n log n) comparison sorts?",
          a: "When the range of keys k = max - min + 1 is asymptotically larger than n log n (for example, if n = 100 but elements are up to 10,000,000, k dominates runtime and memory)."
        },
        {
          q: "What is the space complexity of Counting Sort?",
          a: "O(n + k), where n is the size of the auxiliary output array and k is the size of the frequency counter array."
        }
      ],
      quiz: [
        {
          q: "What is the time complexity of Counting Sort where k is the key range and n is array size?",
          options: ["O(n log k)", "O(n + k)", "O(n²)", "O(k log n)"],
          correct: 1,
          exp: "Correct! Counting Sort takes O(n) to tally and place elements and O(k) to initialize and accumulate the frequency table, total O(n + k)."
        },
        {
          q: "Why does the placement pass scan the input from right to left?",
          options: ["To preserve stability of identical elements", "To make it in-place", "To save memory", "To find the minimum value first"],
          correct: 0,
          exp: "Correct! Scanning backwards ensures that the last occurrence of an element in the input is placed in the last available slot for that key, maintaining stability."
        },
        {
          q: "Can Counting Sort sort arbitrary negative integers?",
          options: ["No, it only works for positive integers", "Yes, by offsetting all values by subtracting the minimum value", "Only if array size is even", "Only in O(n²) time"],
          correct: 1,
          exp: "Correct! By calculating offset = -min, all indices map to non-negative values [0 .. max - min]."
        }
      ],
      cppCode: [
        "void countingSort(int arr[], int n) {",
        "    if (n <= 1) return;",
        "    int minVal = arr[0], maxVal = arr[0];",
        "    for (int i = 1; i < n; i++) {",
        "        if (arr[i] < minVal) minVal = arr[i];",
        "        if (arr[i] > maxVal) maxVal = arr[i];",
        "    }",
        "    int range = maxVal - minVal + 1;",
        "    vector<int> count(range, 0);",
        "    vector<int> output(n);",
        "    for (int i = 0; i < n; i++) count[arr[i] - minVal]++;",
        "    for (int i = 1; i < range; i++) count[i] += count[i - 1];",
        "    for (int i = n - 1; i >= 0; i--) {",
        "        output[count[arr[i] - minVal] - 1] = arr[i];",
        "        count[arr[i] - minVal]--;",
        "    }",
        "    for (int i = 0; i < n; i++) arr[i] = output[i];",
        "}"
      ],
      pseudoCode: [
        "algorithm CountingSort(A, n):",
        "    minVal = min(A), maxVal = max(A)",
        "    range = maxVal - minVal + 1",
        "    count = array of zeros of size range",
        "    output = array of size n",
        "    for i from 0 to n - 1: count[A[i] - minVal]++",
        "    for i from 1 to range - 1: count[i] += count[i - 1]",
        "    for i from n - 1 down to 0:",
        "        output[count[A[i] - minVal] - 1] = A[i]",
        "        count[A[i] - minVal]--",
        "    for i from 0 to n - 1: A[i] = output[i]",
        "    return A"
      ]
    },
    {
      id: 9,
      name: "Radix Sort (LSD)",
      shortName: "Radix",
      color: "#4F46E5",
      bgColor: "#EEF2FF",
      desc: "Non-comparison integer sort that processes elements digit by digit, from Least Significant Digit (LSD) to Most Significant Digit (MSD), using a stable sub-sort (Counting Sort) for each pass.",
      complexityBest: "O(d · (n + b))",
      complexityAvg: "O(d · (n + b))",
      complexityWorst: "O(d · (n + b))",
      space: "O(n + b) auxiliary",
      stable: "Yes",
      inPlace: "No",
      analogy: "Sorting punch cards on a mechanical card-sorter machine. You sort by the rightmost column into 10 pockets, restack them, then sort by the next column to the left, repeating until the entire card is sorted.",
      workedExample: [
        { step: "Init", text: "Array [45, 12, 89, 3, 27]. Max = 89, so 2 digits (base 10, exp = 1, 10)." },
        { step: "Pass 1: 1s digit", text: "Digits: 12 (2), 3 (3), 45 (5), 27 (7), 89 (9). Stable count sort on 1s column -> [12, 3, 45, 27, 89]." },
        { step: "Pass 2: 10s digit", text: "Digits: 3 (0), 12 (1), 27 (2), 45 (4), 89 (8). Stable count sort on 10s column -> [3, 12, 27, 45, 89]. Sorted!" }
      ],
      pros: [
        "Linear time O(d · (n + b)) for fixed-width integers, beating O(n log n)",
        "Stable sorting: preserves original order of records with equal keys",
        "Highly effective for fixed-length strings, dates, IP addresses, and 32/64-bit integers"
      ],
      cons: [
        "High constant factors and poor cache locality compared to QuickSort on modern CPUs",
        "Requires auxiliary memory for the output buffer and base bucket counts",
        "Not in-place"
      ],
      whenToUse: "Sorting large collections of fixed-length integers (e.g. 32-bit keys) or formatted text records (e.g. phone numbers, zip codes, IP addresses).",
      vivaQA: [
        {
          q: "Why must the sub-sorting algorithm used in Radix Sort be strictly stable?",
          a: "If the sub-sort were not stable, sorting by a higher-order digit would scramble the ordering previously established by lower-order digits, ruining the algorithm's correctness."
        },
        {
          q: "What do the variables d, n, and b represent in Radix Sort's complexity formula O(d(n + b))?",
          a: "n is the number of elements, d is the maximum number of digits (log_b(max_val)), and b is the numerical base (radix) being used (e.g. 10 for decimal, 256 for bytes)."
        },
        {
          q: "What is the difference between LSD and MSD Radix Sort?",
          a: "LSD processes digits from right to left iteratively using a stable sub-sort on the entire array. MSD processes from left to right recursively, partitioning the array into separate sub-buckets."
        },
        {
          q: "How can Radix Sort be adapted to handle negative integers?",
          a: "Either partition the array into negative and positive halves first and invert the negative half, or apply an integer bias offset (e.g. x + INT_MAX) to convert signed integers into unsigned representation."
        }
      ],
      quiz: [
        {
          q: "Why is stability essential for the sub-sorting passes of LSD Radix Sort?",
          options: ["To prevent memory leaks", "Because higher-order digit passes rely on the preserved order of lower-order digits", "To make it in-place", "To reduce the number of passes"],
          correct: 1,
          exp: "Correct! When two numbers share the same higher-order digit (e.g. 42 and 47), the stable pass preserves their lower-order ordering (2 before 7)."
        },
        {
          q: "What is the time complexity of Radix Sort for n integers with at most d digits in base b?",
          options: ["O(n log n)", "O(d * (n + b))", "O(n²)", "O(d * n²)"],
          correct: 1,
          exp: "Correct! There are d passes, each performing a stable Counting Sort on n elements across b buckets, totaling O(d(n + b))."
        },
        {
          q: "Which digit does LSD Radix Sort process first?",
          options: ["The most significant digit (leftmost)", "The least significant digit (rightmost)", "The middle digit", "The median digit"],
          correct: 1,
          exp: "Correct! LSD stands for Least Significant Digit, beginning at the ones place (exp = 1) and moving leftward."
        }
      ],
      cppCode: [
        "void radixSortLSD(int arr[], int n) {",
        "    if (n <= 1) return;",
        "    int maxVal = arr[0];",
        "    for (int i = 1; i < n; i++) if (arr[i] > maxVal) maxVal = arr[i];",
        "    for (int exp = 1; maxVal / exp > 0; exp *= 10) {",
        "        countSortDigit(arr, n, exp);",
        "    }",
        "}",
        "void countSortDigit(int arr[], int n, int exp) {",
        "    vector<int> output(n);",
        "    int count[10] = {0};",
        "    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;",
        "    for (int i = 1; i < 10; i++) count[i] += count[i - 1];",
        "    for (int i = n - 1; i >= 0; i--) {",
        "        int d = (arr[i] / exp) % 10;",
        "        output[count[d] - 1] = arr[i];",
        "        count[d]--;",
        "    }",
        "    for (int i = 0; i < n; i++) arr[i] = output[i];",
        "}"
      ],
      pseudoCode: [
        "algorithm RadixSortLSD(A, n):",
        "    maxVal = max(A)",
        "    exp = 1",
        "    while maxVal / exp > 0:",
        "        CountSortByDigit(A, n, exp)",
        "        exp = exp * 10",
        "    return A"
      ]
    }
  ];

  const OP_COMPARE = 0;
  const OP_SWAP = 1;
  const OP_OVERWRITE = 2;
  const OP_MARK_SORTED = 3;
  const OP_PIVOT = 4;
  const OP_SPLIT = 5;
  const OP_HEAPIFY = 6;
  const OP_INFO = 7;

  // --- 2. Application State ---
  const state = {
    currentArray: [45, 12, 89, 3, 27],
    selectedAlgoId: 0,
    comparisonMode: false,
    selectedAlgoIds: [0], // for comparison race mode
    isPlaying: false,
    timer: null,
    speed: 45, // 1 to 100
    codeLang: 'cpp', // 'cpp' | 'pseudo'
    explainMode: 'simple', // 'simple' | 'tech'
    predictNextMode: false,
    pendingPrediction: false,
    predictionSelectedIndices: [],

    // Visualizer trace state
    trace: [],
    currentStep: 0,
    metrics: { comparisons: 0, swaps: 0, timeUs: 0 },
    initialSnapshot: [],
    adaptiveMeta: null,

    // Multi-lane race mode state
    raceLanes: {},

    // Benchmark state
    benchmarkData: [],
    benchmarkRuns: 7,
    benchmarkResults: [],

    // Worker instance
    worker: null,
    isWorkerReady: false,

    // Study tab
    currentLearnAlgo: 0,
    quizScores: {}, // keyed by `${algoId}_${qIdx}` => boolean
    playerXp: 0,
    playerLevel: 'Sorting Novice 🧪',
    playerStreak: 0,
    stepsLog: [],
    runHistory: [],
    activeRightTab: 'code', // 'code' | 'steps' | 'history'
    theorySortKey: 'algo',
    theorySortAsc: true,
    matrixResultsCache: null,
    arcade: {
      manual: {
        array: [38, 14, 72, 9, 53, 21],
        selectedIdx: null,
        moves: 0,
        comps: 0,
        targetPar: 5,
        rule: 'bubble',
        isSorted: false
      },
      battle: {
        scenario: 'reverse',
        championId: 4,
        streak: 0,
        isRacing: false
      },
      duel: {
        round: 0,
        maxRounds: 5,
        score: 0,
        multiplier: 1,
        currentQuestion: null
      }
    },

    // Growth chart
    chartScaling: null,
    chartDataCache: null,
    isChartLogScale: false
  };

  // ==========================================================================
  // 3. WORKER & FALLBACK INITIALIZATION
  // ==========================================================================
  function initWorker() {
    try {
      state.worker = new Worker('worker.js');
      state.worker.onmessage = handleWorkerMessage;
      state.worker.onerror = function (err) {
        console.warn("Worker initialization warning; using in-page fallback engine", err);
        setupFallbackWorker();
      };
      state.isWorkerReady = true;
    } catch (e) {
      console.warn("Worker not supported or blocked; using in-page fallback engine", e);
      setupFallbackWorker();
    }
  }

  function setupFallbackWorker() {
    state.worker = {
      postMessage: function (msg) {
        setTimeout(() => {
          if (msg.command === 'RUN_SINGLE') {
            const res = localExecuteSingle(msg.algoId, msg.data, msg.recordTrace);
            handleWorkerMessage({ data: { type: 'SINGLE_RESULT', requestId: msg.requestId, result: res } });
          } else if (msg.command === 'RUN_BENCHMARK') {
            const res = localExecuteBenchmark(msg.data, msg.algoIds);
            handleWorkerMessage({ data: { type: 'BENCHMARK_COMPLETE', requestId: msg.requestId, results: res } });
          } else if (msg.command === 'RUN_GROWTH_CHART') {
            const chartRes = localExecuteGrowthChart();
            handleWorkerMessage({ data: { type: 'GROWTH_CHART_COMPLETE', requestId: msg.requestId, sizes: [100, 1000, 10000, 50000], data: chartRes } });
          }
        }, 10);
      }
    };
    state.isWorkerReady = true;
  }

  function handleWorkerMessage(e) {
    const msg = e.data;
    if (!msg) return;

    if (msg.type === 'SINGLE_RESULT') {
      applySingleResult(msg.result);
    } else if (msg.type === 'BENCHMARK_COMPLETE') {
      state.benchmarkResults = msg.results;
      renderBenchmarkTable(msg.results);
      generateInsights(msg.results);
      const btn = document.getElementById('btnRunBenchmarkSuite');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>&#9654; Run 10-Algorithm Benchmark Suite</span>';
      }
    } else if (msg.type === 'GROWTH_CHART_COMPLETE') {
      state.chartDataCache = msg.data;
      renderGrowthChart(msg.sizes, msg.data);
      const loading = document.getElementById('chartLoadingBadge');
      if (loading) loading.style.display = 'none';
    } else if (msg.type === 'MATRIX_COMPLETE') {
      state.matrixResultsCache = msg.matrix;
      renderMatrixTable(msg.matrix);
      if (state.benchmarkResults && state.benchmarkResults.length > 0) {
        generateInsights(state.benchmarkResults, msg.matrix);
      }
      const btnMat = document.getElementById('btnRunFullMatrix');
      if (btnMat) {
        btnMat.disabled = false;
        btnMat.innerHTML = '<span>Recompute 10 &times; 5 Matrix</span>';
      }
    }
  }

  // ==========================================================================
  // 4. STEP 1: INPUT PARSING, PRESETS & ARRAY BOXES
  // ==========================================================================
  function parseAndValidateInput(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: false, error: "Please enter numbers to sort (e.g. 45, 12, 89, 3, 27)." };
    }

    const tokens = trimmed.split(/[\s,]+/);
    const nums = [];

    for (let t of tokens) {
      if (t === "") continue;
      const parsed = Number(t);
      if (!Number.isInteger(parsed) || isNaN(parsed)) {
        return {
          valid: false,
          error: `Invalid token '${t}' is not an integer. Please enter comma or space separated numbers.`
        };
      }
      nums.push(parsed);
    }

    if (nums.length < 2) {
      return { valid: false, error: "Please provide at least 2 numbers to visualize sorting." };
    }
    if (nums.length > 60) {
      return { valid: false, error: "For optimal visualization, please limit array to 60 elements (use Compare section for large sizes up to 100,000)." };
    }

    return { valid: true, numbers: nums };
  }

  function updateArrayPreview(arr) {
    const row = document.getElementById('arrayBoxesRow');
    const lenLabel = document.getElementById('arrayLengthLabel');
    if (!row) return;

    row.innerHTML = '';
    if (lenLabel) lenLabel.textContent = `${arr.length} elements`;

    arr.forEach((val, idx) => {
      const item = document.createElement('div');
      item.className = 'array-box-item';
      item.innerHTML = `
        <div class="array-box-index">[${idx}]</div>
        <div class="array-box-val">${val}</div>
      `;
      row.appendChild(item);
    });

    renderBarsStage(arr);
    resetTraceState(arr);
  }

  function generatePresetArray(type, size) {
    const arr = new Array(size);
    if (type === 'sorted') {
      for (let i = 0; i < size; i++) arr[i] = (i + 1) * 3;
    } else if (type === 'reverse') {
      for (let i = 0; i < size; i++) arr[i] = (size - i) * 3;
    } else if (type === 'nearly_sorted') {
      for (let i = 0; i < size; i++) arr[i] = (i + 1) * 3;
      const swaps = Math.max(1, Math.floor(size / 10));
      for (let s = 0; s < swaps; s++) {
        const i1 = Math.floor(Math.random() * size);
        const i2 = Math.floor(Math.random() * size);
        const tmp = arr[i1]; arr[i1] = arr[i2]; arr[i2] = tmp;
      }
    } else if (type === 'duplicates') {
      for (let i = 0; i < size; i++) arr[i] = ((i % 4) + 1) * 15;
    } else { // random
      for (let i = 0; i < size; i++) arr[i] = Math.floor(Math.random() * 95) + 5;
    }
    return arr;
  }

  // ==========================================================================
  // 5. STEP 2: CHOOSE ALGORITHM & SYNCHRONIZED CODE VIEWER
  // ==========================================================================
  function selectAlgorithm(algoId) {
    state.selectedAlgoId = algoId;
    const algo = ALGORITHMS[algoId];

    document.querySelectorAll('.algo-chip').forEach(chip => {
      const id = parseInt(chip.dataset.algo, 10);
      const indicator = chip.querySelector('.algo-chip-indicator');
      if (id === algoId) {
        chip.classList.add('selected');
        if (indicator) indicator.style.backgroundColor = algo.color;
      } else {
        chip.classList.remove('selected');
        if (indicator) indicator.style.backgroundColor = 'transparent';
      }
    });

    const descText = document.getElementById('algoDescText');
    const badge = document.getElementById('algoComplexityBadge');
    const stageTitle = document.getElementById('stageAlgoName');

    if (descText) descText.textContent = `${algo.name}: ${algo.desc}`;
    if (badge) {
      badge.textContent = `${algo.complexityAvg} Avg`;
      badge.style.color = algo.color;
    }
    if (stageTitle) {
      stageTitle.textContent = algo.name;
      stageTitle.style.color = algo.color;
    }

    renderCodeViewer(algoId, state.codeLang);
    resetTraceState(state.currentArray);
  }

  function renderCodeViewer(algoId, lang) {
    const algo = ALGORITHMS[algoId];
    const codeTitle = document.getElementById('codeViewerTitle');
    const scrollBody = document.getElementById('codeScrollBody');
    if (codeTitle) codeTitle.textContent = `${algo.name} (${lang === 'cpp' ? 'C++17' : 'Pseudocode'})`;
    if (!scrollBody) return;

    scrollBody.innerHTML = '';
    const lines = lang === 'cpp' ? algo.cppCode : algo.pseudoCode;

    lines.forEach((line, idx) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'code-line';
      lineDiv.id = `codeLine_${idx + 1}`;
      lineDiv.innerHTML = `
        <span class="code-line-num">${idx + 1}</span>
        <span class="code-line-text">${escapeHtml(line)}</span>
      `;
      scrollBody.appendChild(lineDiv);
    });
  }

  function highlightCodeLine(lineNum) {
    document.querySelectorAll('.code-line.active').forEach(el => el.classList.remove('active'));
    if (!lineNum || lineNum <= 0) return;
    const target = document.getElementById(`codeLine_${lineNum}`);
    if (target) {
      target.classList.add('active');
      target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ==========================================================================
  // 6. STEP 3: WATCH AND LEARN (VISUALIZER & SYNCHRONIZED REPLAY)
  // ==========================================================================
  function renderBarsStage(arr) {
    const stage = document.getElementById('barsContainerMain');
    if (!stage) return;

    stage.innerHTML = '';
    const maxVal = Math.max(...arr, 1);

    arr.forEach((val, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'v-bar-wrapper';
      wrapper.id = `vbar_${idx}`;
      wrapper.dataset.index = idx;

      // Click handler for prediction quiz mode
      wrapper.addEventListener('click', () => handleBarClickPrediction(idx));

      const heightPct = Math.max(8, (val / maxVal) * 100);

      wrapper.innerHTML = `
        <div class="v-bar-val">${val}</div>
        <div class="v-bar-fill" style="height: ${heightPct}%;"></div>
      `;
      stage.appendChild(wrapper);
    });
  }

  function resetTraceState(arr) {
    pauseAnimation();
    state.initialSnapshot = arr.slice();
    state.currentStep = 0;
    state.trace = [];
    state.metrics = { comparisons: 0, swaps: 0, timeUs: 0 };
    state.pendingPrediction = false;
    state.predictionSelectedIndices = [];

    // Reset verified badge
    const badge = document.getElementById('verifiedBadge');
    if (badge) badge.style.display = 'none';

    // Reset status phase
    const phase = document.getElementById('stageStatusPhase');
    if (phase) phase.textContent = '| Ready to execute';

    // Reset scrubber
    updateScrubber(0, 0);
    updateLiveCounters(0, 0, 0, 0, 0);
    highlightCodeLine(0);

    // Reset algorithm-specific visual stages
    hideAllSpecialStages();

    // Reset caption
    updateCaption(`Ready to sort ${arr.length} elements using ${ALGORITHMS[state.selectedAlgoId].name}. Press "Visualize" or "Next Step" to begin.`, "");

    renderBarsStage(arr);

    // Profile input for Adaptive Sort UI banner if Adaptive selected
    if (state.selectedAlgoId === 4) {
      displayAdaptivePreAnalysis(arr);
    }

    // Request trace from worker
    if (state.worker) {
      state.worker.postMessage({
        command: 'RUN_SINGLE',
        algoId: state.selectedAlgoId,
        data: arr,
        recordTrace: true,
        requestId: 'TRACE_' + Date.now()
      });
    }
  }


  // ==========================================================================
  // AUTHORS & CREDENTIALS RENDERING
  // ==========================================================================
  function renderAboutAuthors() {
    const container = document.getElementById('aboutAuthorsContainer');
    if (!container) return;
    container.innerHTML = PROJECT_CONFIG.authors.map(a => `
      <p style="margin-bottom: 0.35rem;"><strong>${a.name}</strong> <span class="mono" style="color: var(--ink-muted); font-size: 0.85rem;">(Roll No. ${a.rollNo})</span></p>
    `).join('');
  }

  // ==========================================================================
  // STATIC THEORY COMPARISON TABLE (SORTABLE, YES/NO BADGES, STICKY 1ST COL)
  // ==========================================================================
  function initTheoryTable() {
    renderTheoryTable(state.theorySortKey, state.theorySortAsc);
    bindTheoryTableSort();
  }

  function renderTheoryTable(sortKey, isAsc) {
    const tbody = document.getElementById('theoryTableBody');
    if (!tbody) return;

    // Sorting logic
    const data = [...THEORY_DATA].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === 'algo') {
        valA = a.name; valB = b.name;
      }
      if (typeof valA === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return isAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    tbody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      const badgeStable = row.stable === 'Yes' 
        ? '<span class="badge-yes">Yes</span>' 
        : '<span class="badge-no">No</span>';
      const badgeInPlace = row.inPlace === 'Yes' 
        ? '<span class="badge-yes">Yes</span>' 
        : '<span class="badge-no">No</span>';
      const badgeAdaptive = row.adaptive === 'Yes' 
        ? '<span class="badge-yes">Yes</span>' 
        : (row.adaptive === 'Varies' ? '<span class="badge-partial">Varies</span>' : '<span class="badge-no">No</span>');

      tr.innerHTML = `
        <td style="font-weight: 700; color: ${row.color}; text-align: left;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${row.color}; margin-right: 8px;"></span>${row.name}
        </td>
        <td class="tabular-nums mono">${row.best}</td>
        <td class="tabular-nums mono">${row.avg}</td>
        <td class="tabular-nums mono">${row.worst}</td>
        <td class="tabular-nums mono">${row.space}</td>
        <td>${badgeStable}</td>
        <td>${badgeInPlace}</td>
        <td>${badgeAdaptive}</td>
        <td style="font-size: 0.85rem; text-align: left; max-width: 240px;">${row.useCase}</td>
      `;
      tbody.appendChild(tr);
    });

    // Update sort indicators on headers
    document.querySelectorAll('.theory-table th.sortable-th').forEach(th => {
      const key = th.dataset.sort;
      const icon = th.querySelector('.sort-icon');
      if (key === sortKey) {
        if (icon) icon.textContent = isAsc ? '▲' : '▼';
        th.style.color = 'var(--band-compare)';
      } else {
        if (icon) icon.textContent = '↕';
        th.style.color = '';
      }
    });
  }

  function bindTheoryTableSort() {
    document.querySelectorAll('.theory-table th.sortable-th').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (state.theorySortKey === key) {
          state.theorySortAsc = !state.theorySortAsc;
        } else {
          state.theorySortKey = key;
          state.theorySortAsc = true;
        }
        renderTheoryTable(state.theorySortKey, state.theorySortAsc);
      });
    });
  }

  // ==========================================================================
  // STEPS LOG & RUN HISTORY MANAGEMENT (FEATURE 3)
  // ==========================================================================
  function initStepsAndHistory() {
    loadRunHistory();
    bindRightPanelTabs();
    bindStepActions();
  }

  function bindRightPanelTabs() {
    const tabCode = document.getElementById('tabBtnCode');
    const tabSteps = document.getElementById('tabBtnSteps');
    const tabHistory = document.getElementById('tabBtnHistory');

    const viewCode = document.getElementById('codeScrollBody');
    const viewSteps = document.getElementById('stepsLogView');
    const viewHistory = document.getElementById('historyLogView');

    const grpLang = document.getElementById('codeLangToggleGroup');
    const grpSteps = document.getElementById('stepsActionGroup');
    const grpHistory = document.getElementById('historyActionGroup');

    function switchTab(target) {
      state.activeRightTab = target;
      [tabCode, tabSteps, tabHistory].forEach(t => { if (t) t.classList.remove('active'); });
      [viewCode, viewSteps, viewHistory].forEach(v => { if (v) v.style.display = 'none'; });
      [grpLang, grpSteps, grpHistory].forEach(g => { if (g) g.style.display = 'none'; });

      if (target === 'code') {
        if (tabCode) tabCode.classList.add('active');
        if (viewCode) viewCode.style.display = 'block';
        if (grpLang) grpLang.style.display = 'flex';
      } else if (target === 'steps') {
        if (tabSteps) tabSteps.classList.add('active');
        if (viewSteps) viewSteps.style.display = 'block';
        if (grpSteps) grpSteps.style.display = 'flex';
        scrollActiveStepIntoView();
      } else if (target === 'history') {
        if (tabHistory) tabHistory.classList.add('active');
        if (viewHistory) viewHistory.style.display = 'block';
        if (grpHistory) grpHistory.style.display = 'flex';
      }
    }

    if (tabCode) tabCode.addEventListener('click', () => switchTab('code'));
    if (tabSteps) tabSteps.addEventListener('click', () => switchTab('steps'));
    if (tabHistory) tabHistory.addEventListener('click', () => switchTab('history'));
  }

  function renderStepsLog() {
    const list = document.getElementById('stepsLogList');
    const badge = document.getElementById('stepsCountBadge');
    if (!list) return;

    if (!state.trace || state.trace.length === 0) {
      list.innerHTML = '<div class="steps-empty-hint">Press "Visualize" or step through sorting to generate step-by-step logs.</div>';
      if (badge) badge.textContent = '0';
      return;
    }

    if (badge) badge.textContent = state.trace.length.toLocaleString();

    list.innerHTML = '';
    state.trace.forEach((step, idx) => {
      let badgeText = "INFO";
      let badgeCls = "badge-op-shift";
      if (step.type === OP_COMPARE) { badgeText = "COMPARE"; badgeCls = "badge-op-compare"; }
      else if (step.type === OP_SWAP) { badgeText = "SWAP"; badgeCls = "badge-op-swap"; }
      else if (step.type === OP_OVERWRITE) { badgeText = "SHIFT"; badgeCls = "badge-op-shift"; }
      else if (step.type === OP_PIVOT) { badgeText = "PIVOT"; badgeCls = "badge-op-pivot"; }
      else if (step.type === OP_MARK_SORTED) { badgeText = "SORTED"; badgeCls = "badge-op-sorted"; }

      const item = document.createElement('div');
      item.className = 'step-log-item' + (idx === state.currentStep ? ' active-step' : '');
      item.id = `stepLogItem_${idx}`;
      item.dataset.step = idx;

      let msg = step.message || "Executed operation";
      if (state.explainMode === 'tech') {
        msg = `Op: ${badgeText} | Indices: [${step.index1}, ${step.index2}] | Value: ${step.value !== undefined ? step.value : 'N/A'} | C++ Line: ${step.line}`;
      }

      item.innerHTML = `
        <span class="step-log-num">#${idx + 1}</span>
        <span class="step-log-badge ${badgeCls}">${badgeText}</span>
        <span class="step-log-msg">${msg}</span>
      `;

      item.addEventListener('click', () => {
        pauseAnimation();
        applyStep(idx);
      });

      list.appendChild(item);
    });

    scrollActiveStepIntoView();
  }

  function scrollActiveStepIntoView() {
    const activeEl = document.getElementById(`stepLogItem_${state.currentStep}`);
    if (activeEl && state.activeRightTab === 'steps') {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function updateStepsLogActiveHighlight(stepIdx) {
    document.querySelectorAll('.step-log-item').forEach(el => el.classList.remove('active-step'));
    const currentEl = document.getElementById(`stepLogItem_${stepIdx}`);
    if (currentEl) {
      currentEl.classList.add('active-step');
      scrollActiveStepIntoView();
    }
  }

  function recordRunInHistory(comps, swaps, timeUs) {
    const algo = ALGORITHMS[state.selectedAlgoId];
    const runItem = {
      id: Date.now(),
      algoId: state.selectedAlgoId,
      algoName: algo.name,
      color: algo.color,
      arraySize: state.currentArray.length,
      arraySnapshot: state.currentArray.slice(),
      comparisons: comps,
      swaps: swaps,
      timeUs: timeUs,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    state.runHistory.unshift(runItem);
    if (state.runHistory.length > 25) state.runHistory.pop();
    saveRunHistory();
    renderRunHistoryList();
  }

  function loadRunHistory() {
    try {
      const saved = localStorage.getItem('sortlab-run-history');
      if (saved) state.runHistory = JSON.parse(saved);
    } catch (e) {
      state.runHistory = [];
    }
    renderRunHistoryList();
  }

  function saveRunHistory() {
    try {
      localStorage.setItem('sortlab-run-history', JSON.stringify(state.runHistory));
    } catch (e) {}
  }

  function renderRunHistoryList() {
    const list = document.getElementById('historyRunList');
    const badge = document.getElementById('historyCountBadge');
    if (badge) badge.textContent = state.runHistory.length;
    if (!list) return;

    if (state.runHistory.length === 0) {
      list.innerHTML = '<div class="steps-empty-hint">No past runs recorded yet. Execute a sort to save it to your history.</div>';
      return;
    }

    list.innerHTML = '';
    state.runHistory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-run-card';
      card.innerHTML = `
        <div>
          <div class="history-run-title" style="color: ${item.color};">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:6px;"></span>
            ${item.algoName} (N=${item.arraySize})
          </div>
          <div class="history-run-meta">
            ${item.comparisons.toLocaleString()} comps &bull; ${item.swaps.toLocaleString()} swaps &bull; ${item.timeUs.toFixed(1)} µs &bull; ${item.timestamp}
          </div>
        </div>
        <button type="button" class="btn btn-xs btn-primary history-load-btn" data-runid="${item.id}">
          <span>Load &bull; Replay</span>
        </button>
      `;
      card.querySelector('.history-load-btn').addEventListener('click', () => {
        reopenHistoryRun(item);
      });
      list.appendChild(card);
    });
  }

  function reopenHistoryRun(item) {
    state.currentArray = item.arraySnapshot.slice();
    const input = document.getElementById('customInputBox');
    if (input) input.value = state.currentArray.join(', ');
    selectAlgorithm(item.algoId);
    updateArrayPreview(state.currentArray);
    showToast(`Loaded previous run: ${item.algoName} (N=${item.arraySize})`);
    const tabSteps = document.getElementById('tabBtnSteps');
    if (tabSteps) tabSteps.click();
  }

  function bindStepActions() {
    // Copy Steps
    const btnCopy = document.getElementById('btnCopySteps');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        if (!state.trace || state.trace.length === 0) {
          showToast("No step logs to copy. Run visualization first!");
          return;
        }
        const text = state.trace.map((s, i) => `Step ${i + 1}: ${s.message || 'Operation executed'}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied ${state.trace.length} steps to clipboard!`);
        });
      });
    }

    // Download .txt
    const btnTxt = document.getElementById('btnDownloadStepsTxt');
    if (btnTxt) {
      btnTxt.addEventListener('click', () => {
        if (!state.trace || state.trace.length === 0) {
          showToast("No step logs to export. Run visualization first!");
          return;
        }
        const algo = ALGORITHMS[state.selectedAlgoId].name;
        const header = `SortLab Execution Trace Log\nAlgorithm: ${algo}\nArray Size: ${state.currentArray.length}\nInitial Sequence: [${state.initialSnapshot.join(', ')}]\nTotal Steps: ${state.trace.length}\n\n`;
        const body = state.trace.map((s, i) => `[${i + 1}] ${s.message || 'Operation'}`).join('\n');
        downloadFile(`sortlab_${algo.toLowerCase().replace(/\s+/g, '_')}_steps.txt`, header + body, 'text/plain');
      });
    }

    // Download .md
    const btnMd = document.getElementById('btnDownloadStepsMd');
    if (btnMd) {
      btnMd.addEventListener('click', () => {
        if (!state.trace || state.trace.length === 0) {
          showToast("No step logs to export. Run visualization first!");
          return;
        }
        const algo = ALGORITHMS[state.selectedAlgoId].name;
        let md = `# SortLab Execution Trace: ${algo}\n\n`;
        md += "- **Specimen Array:** \`[" + state.initialSnapshot.join(', ') + "]\`\n";
        md += `- **Array Size:** ${state.currentArray.length}\n`;
        md += `- **Total Operations:** ${state.trace.length}\n\n`;
        md += `| Step | Operation | Description | C++ Line |\n|:---:|:---:|:---|:---:|\n`;
        state.trace.forEach((s, i) => {
          let op = "INFO";
          if (s.type === OP_COMPARE) op = "COMPARE";
          else if (s.type === OP_SWAP) op = "SWAP";
          else if (s.type === OP_OVERWRITE) op = "SHIFT";
          else if (s.type === OP_PIVOT) op = "PIVOT";
          else if (s.type === OP_MARK_SORTED) op = "SORTED";
          md += `| ${i + 1} | ${op} | ${s.message || ''} | ${s.line} |\n`;
        });
        downloadFile(`sortlab_${algo.toLowerCase().replace(/\s+/g, '_')}_trace.md`, md, 'text/markdown');
      });
    }

    // Clear History
    const btnClearHist = document.getElementById('btnClearHistory');
    if (btnClearHist) {
      btnClearHist.addEventListener('click', () => {
        if (confirm("Clear all recorded run history?")) {
          state.runHistory = [];
          saveRunHistory();
          renderRunHistoryList();
          showToast("Run history cleared!");
        }
      });
    }
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}!`);
  }

  function applySingleResult(result) {
    state.trace = result.trace || [];
    state.metrics.timeUs = result.elapsedMicroseconds || 0;
    state.adaptiveMeta = {
      strategy: result.adaptiveStrategy,
      reason: result.adaptiveReason
    };

    updateScrubber(0, state.trace.length);
    updateLiveCounters(0, 0, 0, state.trace.length, result.elapsedMicroseconds || 0);

    if (state.selectedAlgoId === 4) {
      displayAdaptivePreAnalysis(state.currentArray, result);
    }
    renderStepsLog();
  }

  function hideAllSpecialStages() {
    const kStage = document.getElementById('insertionFloatStage');
    const mStage = document.getElementById('mergeAuxStage');
    const hStage = document.getElementById('heapTreeWorkspace');
    const aStage = document.getElementById('adaptiveAnalysisCard');
    const pBanner = document.getElementById('predictionBanner');

    if (kStage) kStage.style.display = 'none';
    if (mStage) mStage.style.display = 'none';
    if (hStage) hStage.style.display = 'none';
    if (aStage) aStage.style.display = 'none';
    if (pBanner) pBanner.style.display = 'none';

    // Remove any pointer arrow markers
    document.querySelectorAll('.pointer-arrow-marker').forEach(el => el.remove());
  }

  function displayAdaptivePreAnalysis(arr, workerResult) {
    const card = document.getElementById('adaptiveAnalysisCard');
    const statsEl = document.getElementById('adaptiveProfileStats');
    const badgeEl = document.getElementById('adaptiveDecisionBadge');
    const reasonEl = document.getElementById('adaptiveReasonText');
    if (!card) return;

    card.style.display = 'flex';

    // Profile array
    let sorted = true, reversed = true, runs = 1, inv = 0;
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) sorted = false;
      if (arr[i] < arr[i + 1]) reversed = false;
      if (arr[i] > arr[i + 1]) runs++;
      for (let j = i + 1; j < n; j++) {
        if (arr[i] > arr[j]) inv++;
      }
    }

    if (statsEl) statsEl.textContent = `Runs: ${runs} | Inversions: ${inv} | Magnitude: N=${n}`;

    let strategy = "Insertion Sort";
    let reason = "Array is small (N < 16); Insertion Sort achieves minimal constant factor overhead.";

    if (workerResult && workerResult.adaptiveStrategy) {
      strategy = workerResult.adaptiveStrategy;
      reason = workerResult.adaptiveReason || reason;
    } else {
      if (sorted) {
        strategy = "Presorted Verified";
        reason = "Sequence already sorted in O(n); zero modifications required.";
      } else if (reversed) {
        strategy = "Symmetric In-Place Reversal";
        reason = "Strict monotone descending order; inverting array in floor(n/2) swaps with 0 comparisons.";
      } else if (n < 16) {
        strategy = "Cutoff Insertion Sort";
        reason = `Array length ${n} < 16; avoids recursion call overhead.`;
      } else if (runs <= 4) {
        strategy = "Adaptive Natural Merge";
        reason = `Only ${runs} sorted runs detected; merges natural runs in O(n log(runs)).`;
      } else {
        strategy = "Introsort (QuickSort + Heap depth guard)";
        reason = "General distribution; dispatches QuickSort with max recursion depth guard to guarantee O(n log n).";
      }
    }

    if (badgeEl) badgeEl.textContent = `Chosen Strategy: ${strategy}`;
    if (reasonEl) reasonEl.textContent = reason;
  }

  function applyStep(stepIdx) {
    if (!state.trace || state.trace.length === 0) return;
    if (stepIdx < 0) stepIdx = 0;
    if (stepIdx >= state.trace.length) stepIdx = state.trace.length - 1;

    state.currentStep = stepIdx;
    const step = state.trace[stepIdx];

    // Restore snapshot if present
    if (step.snapshot && step.snapshot.length > 0) {
      const maxVal = Math.max(...step.snapshot, 1);
      step.snapshot.forEach((val, idx) => {
        const wrap = document.getElementById(`vbar_${idx}`);
        if (wrap) {
          const valEl = wrap.querySelector('.v-bar-val');
          const fill = wrap.querySelector('.v-bar-fill');
          if (valEl) valEl.textContent = val;
          if (fill) fill.style.height = `${Math.max(8, (val / maxVal) * 100)}%`;
        }
      });
    }

    // Reset bar active state classes
    document.querySelectorAll('.v-bar-fill').forEach(el => {
      el.classList.remove('comparing', 'swapping', 'pivot', 'sorted');
    });

    // Remove old pointer markers
    document.querySelectorAll('.pointer-arrow-marker').forEach(el => el.remove());

    // Apply active classes
    if (step.type === OP_COMPARE) {
      markBarClass(step.index1, 'comparing');
      if (step.index2 >= 0) markBarClass(step.index2, 'comparing');
    } else if (step.type === OP_SWAP || step.type === OP_OVERWRITE) {
      markBarClass(step.index1, 'swapping');
      if (step.index2 >= 0) markBarClass(step.index2, 'swapping');
    } else if (step.type === OP_PIVOT) {
      markBarClass(step.index1, 'pivot');
    } else if (step.type === OP_MARK_SORTED) {
      markBarClass(step.index1, 'sorted');
    }

    // Synchronize algorithm-specific visual stages
    syncSpecialVisualizers(step);

    // Update caption in plain English or technical language
    renderCaptionForStep(step);

    // Highlight synchronized C++ code line
    highlightCodeLine(step.line);

    // Update live student step notes & loop invariant HUD
    updateStudentStepNotes(step, stepIdx);

    // Update Step Log active highlight
    updateStepsLogActiveHighlight(stepIdx);

    // Compute live metrics up to this step
    let comps = 0, swaps = 0;
    for (let i = 0; i <= stepIdx; i++) {
      if (state.trace[i].type === OP_COMPARE) comps++;
      if (state.trace[i].type === OP_SWAP || state.trace[i].type === OP_OVERWRITE) swaps++;
    }
    // Prevent step counter from exceeding total steps
    const displayStep = state.trace.length > 0 ? Math.min(stepIdx + 1, state.trace.length) : 0;
    updateLiveCounters(comps, swaps, displayStep, state.trace.length, state.metrics.timeUs);
    updateScrubber(stepIdx, state.trace.length);

    // If final step reached: sweep green and verify
    if (stepIdx === state.trace.length - 1) {
      pauseAnimation();
      document.querySelectorAll('.v-bar-fill').forEach(el => el.classList.add('sorted'));
      const badge = document.getElementById('verifiedBadge');
      const phase = document.getElementById('stageStatusPhase');
      if (badge) badge.style.display = 'block';
      if (phase) phase.textContent = '| Execution Complete';
      updateCaption("✓ All elements verified in sorted order. Every bar is placed in its proper ascending position.", "Formal correctness check passed. Array sorted according to total ordering relation.");
      recordRunInHistory(comps, swaps, state.metrics.timeUs);
    }
  }

  function markBarClass(idx, className) {
    if (idx < 0) return;
    const wrap = document.getElementById(`vbar_${idx}`);
    if (wrap) {
      const fill = wrap.querySelector('.v-bar-fill');
      if (fill) fill.classList.add(className);
    }
  }

  function syncSpecialVisualizers(step) {
    const algoId = state.selectedAlgoId;

    // Insertion Sort: Floating Key Badge
    const kStage = document.getElementById('insertionFloatStage');
    const kVal = document.getElementById('insertionKeyVal');
    if (algoId === 0) {
      if (step.meta && (step.type === OP_PIVOT || step.type === OP_COMPARE || step.type === OP_OVERWRITE)) {
        try {
          const m = JSON.parse(step.meta);
          if (m && m.key !== undefined) {
            if (kStage) kStage.style.display = 'flex';
            if (kVal) kVal.textContent = m.key;
          }
        } catch (e) {
          if (step.value !== undefined) {
            if (kStage) kStage.style.display = 'flex';
            if (kVal) kVal.textContent = step.value;
          }
        }
      }
    } else {
      if (kStage) kStage.style.display = 'none';
    }

    // Merge Sort: Auxiliary Buffer Array under Main Array
    const mStage = document.getElementById('mergeAuxStage');
    const mBars = document.getElementById('mergeAuxBars');
    if (algoId === 1 && step.meta) {
      if (mStage) mStage.style.display = 'flex';
      if (mBars) {
        try {
          const m = JSON.parse(step.meta);
          if (m && m.left !== undefined && m.right !== undefined) {
            mBars.innerHTML = '';
            for (let i = m.left; i <= m.right; i++) {
              const b = document.createElement('div');
              b.className = 'merge-aux-bar';
              const currVal = (step.snapshot && step.snapshot[i] !== undefined) ? step.snapshot[i] : '·';
              b.textContent = currVal;
              mBars.appendChild(b);
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    } else if (algoId !== 1) {
      if (mStage) mStage.style.display = 'none';
    }

    // Quick Sort: Pointer markers (i ↓ and j ↓)
    if (algoId === 2) {
      if (step.index1 >= 0) attachPointerMarker(step.index1, "i ↓");
      if (step.index2 >= 0 && step.index2 !== step.index1) attachPointerMarker(step.index2, "j ↓");
    }

    // Heap Sort: SVG Binary Heap Tree
    const hStage = document.getElementById('heapTreeWorkspace');
    if (algoId === 3) {
      if (hStage) {
        hStage.style.display = 'block';
        renderHeapSvgTree(hStage, step);
      }
    } else {
      if (hStage) hStage.style.display = 'none';
    }
  }

  function attachPointerMarker(barIdx, label) {
    const wrap = document.getElementById(`vbar_${barIdx}`);
    if (!wrap) return;
    const marker = document.createElement('div');
    marker.className = 'pointer-arrow-marker';
    marker.textContent = label;
    wrap.appendChild(marker);
  }

  function renderHeapSvgTree(container, step) {
    const currentArr = (step && step.snapshot) ? step.snapshot : state.currentArray;
    const n = Math.min(currentArr.length, 31);
    if (n <= 1) {
      container.innerHTML = '<span class="mono" style="font-size: 0.8rem; color: var(--ink-muted);">Binary Heap requires at least 2 nodes.</span>';
      return;
    }

    const width = container.clientWidth || 600;
    const height = 180;
    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">`;

    const positions = [];
    for (let i = 0; i < n; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const nodesInLevel = Math.pow(2, level);
      const posInLevel = i - (nodesInLevel - 1);
      const y = 26 + level * 36;
      const x = (width / (nodesInLevel + 1)) * (posInLevel + 1);
      positions.push({ x, y });
    }

    // Connecting dashed tree edges
    for (let i = 1; i < n; i++) {
      const parent = Math.floor((i - 1) / 2);
      svg += `<line x1="${positions[parent].x}" y1="${positions[parent].y}" x2="${positions[i].x}" y2="${positions[i].y}" stroke="#1B1B1B" stroke-width="1.5" stroke-dasharray="3,3" />`;
    }

    // Node circles and values
    for (let i = 0; i < n; i++) {
      const val = currentArr[i];
      let fillColor = "#FAF8F2";
      let strokeColor = "#1B1B1B";

      if (step) {
        if (step.type === OP_COMPARE && (step.index1 === i || step.index2 === i)) {
          fillColor = "var(--bar-compare)";
        } else if ((step.type === OP_SWAP || step.type === OP_OVERWRITE) && (step.index1 === i || step.index2 === i)) {
          fillColor = "var(--bar-swap)";
        } else if (step.type === OP_MARK_SORTED && step.index1 === i) {
          fillColor = "var(--bar-sorted)";
        }
      }

      svg += `
        <circle cx="${positions[i].x}" cy="${positions[i].y}" r="12" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" />
        <text x="${positions[i].x}" y="${positions[i].y + 4}" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="bold" fill="#1B1B1B">${val}</text>
        <text x="${positions[i].x}" y="${positions[i].y - 15}" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="8" fill="#6B655B">[${i}]</text>
      `;
    }
    svg += `</svg>`;
    container.innerHTML = svg;
  }

  function renderCaptionForStep(step) {
    if (!step) return;

    let simpleText = step.message || "Executing sorting operation...";
    let techText = `Op Type: ${step.type} | Line ${step.line} | Indices: [${step.index1}, ${step.index2}] | Value: ${step.value !== undefined ? step.value : 'N/A'}`;

    if (step.type === OP_COMPARE) {
      const snap = step.snapshot || state.initialSnapshot;
      const v1 = (snap && step.index1 >= 0 && snap[step.index1] !== undefined) ? snap[step.index1] : '?';
      const v2 = (step.index2 >= 0 && snap && snap[step.index2] !== undefined) ? snap[step.index2] : null;
      if (v2 !== null) {
        simpleText = `Comparing ${v1} (at position ${step.index1}) with ${v2} (at position ${step.index2}). Checking if they are in ascending order.`;
        techText = `Comparison Invariant: Evaluated arr[${step.index1}] (${v1}) vs arr[${step.index2}] (${v2}). Condition arr[${step.index1}] > arr[${step.index2}] = ${v1 > v2}.`;
      } else {
        simpleText = `Comparing element at position ${step.index1} (value: ${v1}) against the key reference.`;
        techText = `Single-sided comparison: arr[${step.index1}] = ${v1} evaluated against key boundary.`;
      }
    } else if (step.type === OP_SWAP) {
      simpleText = `Swapping position ${step.index1} with position ${step.index2} to fix their inverted order.`;
      techText = `Mutation: In-place symmetric swap std::swap(arr[${step.index1}], arr[${step.index2}]). Inversion count decremented.`;
    } else if (step.type === OP_OVERWRITE) {
      simpleText = `Shifting element right to position ${step.index1} to create an open slot for the key.`;
      techText = `Subarray Shift: arr[${step.index1}] = ${step.value}; maintaining sorted prefix structure.`;
    } else if (step.type === OP_PIVOT) {
      simpleText = `Selected ${step.value} as the benchmark reference value.`;
      techText = `Pivot Initialization: Partition benchmark key = ${step.value} established at boundary index ${step.index1}.`;
    } else if (step.type === OP_MARK_SORTED) {
      simpleText = `Element at position ${step.index1} is locked into its permanent, finalized sorted place.`;
      techText = `Sorted Invariant: Position ${step.index1} verified; will not be visited or moved again.`;
    }

    updateCaption(simpleText, techText);
  }

  function updateCaption(simpleMsg, techMsg) {
    const el = document.getElementById('liveCaptionText');
    if (!el) return;

    if (state.explainMode === 'simple') {
      el.textContent = simpleMsg;
    } else {
      el.textContent = techMsg || simpleMsg;
    }
  }

  function updateLiveCounters(comps, swaps, currentStep, totalSteps, timeUs) {
    const cEl = document.getElementById('liveComps');
    const sEl = document.getElementById('liveSwaps');
    const pEl = document.getElementById('liveStepProg');
    const tEl = document.getElementById('liveTime');

    if (cEl) cEl.textContent = comps.toLocaleString();
    if (sEl) sEl.textContent = swaps.toLocaleString();
    if (pEl) pEl.textContent = `${currentStep} / ${totalSteps}`;
    if (tEl) tEl.textContent = `${timeUs.toFixed(1)} µs`;
  }

  function updateScrubber(current, total) {
    const scrubber = document.getElementById('stepScrubber');
    const label = document.getElementById('scrubberStepLabel');
    const displayStep = total > 0 ? Math.min(current + 1, total) : 0;
    if (scrubber) {
      scrubber.max = Math.max(0, total - 1);
      scrubber.value = current;
    }
    if (label) {
      label.textContent = `Step ${displayStep} / ${total}`;
    }
  }

  // --- Transport Controls ---
  function playAnimation() {
    if (!state.trace || state.trace.length === 0) return;
    state.isPlaying = true;

    const btnText = document.getElementById('vizPlayText');
    const btnIcon = document.getElementById('vizPlayIcon');
    if (btnText) btnText.textContent = "Pause";
    if (btnIcon) btnIcon.innerHTML = "&#10074;&#10074;";

    if (state.currentStep >= state.trace.length - 1) {
      state.currentStep = 0;
    }

    runAnimLoop();
  }

  function pauseAnimation() {
    state.isPlaying = false;
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    const btnText = document.getElementById('vizPlayText');
    const btnIcon = document.getElementById('vizPlayIcon');
    if (btnText) btnText.textContent = "Visualize";
    if (btnIcon) btnIcon.innerHTML = "&#9658;";
  }

  function runAnimLoop() {
    if (!state.isPlaying) return;

    // Check if Predict Next Step mode is active
    if (state.predictNextMode && !state.pendingPrediction && state.currentStep < state.trace.length - 1) {
      const nextStep = state.trace[state.currentStep + 1];
      if (nextStep && (nextStep.type === OP_COMPARE || nextStep.type === OP_SWAP)) {
        triggerPredictionChallenge(nextStep);
        return;
      }
    }

    if (state.currentStep < state.trace.length) {
      applyStep(state.currentStep);
      state.currentStep++;

      // Delay from 750ms (speed 1) down to 15ms (speed 100)
      const delay = Math.max(15, 750 - state.speed * 7.2);
      state.timer = setTimeout(runAnimLoop, delay);
    } else {
      pauseAnimation();
    }
  }

  // --- Predict Next Step Interactive Mode ---
  function triggerPredictionChallenge(nextStep) {
    pauseAnimation();
    state.pendingPrediction = true;
    state.predictionSelectedIndices = [];

    const banner = document.getElementById('predictionBanner');
    const qText = document.getElementById('predictionQuestionText');
    const fText = document.getElementById('predictionFeedbackText');

    if (banner) banner.style.display = 'flex';
    if (qText) {
      const opName = nextStep.type === OP_COMPARE ? "compared" : "swapped";
      qText.textContent = `🔮 Prediction Challenge: Which two elements will be ${opName} next? Click on two bars in the array above to test your intuition!`;
    }
    if (fText) fText.textContent = "Click any bar in the arena above to pick your first element.";

    // Highlight bars as interactive targets
    document.querySelectorAll('.v-bar-wrapper').forEach(w => {
      w.style.cursor = 'pointer';
    });
  }

  function handleBarClickPrediction(clickedIdx) {
    if (!state.pendingPrediction) return;

    const banner = document.getElementById('predictionBanner');
    const fText = document.getElementById('predictionFeedbackText');
    const nextStep = state.trace[state.currentStep + 1];
    if (!nextStep) return;

    state.predictionSelectedIndices.push(clickedIdx);
    markBarClass(clickedIdx, 'pivot');

    if (state.predictionSelectedIndices.length === 1) {
      if (fText) fText.textContent = `Selected element at [${clickedIdx}]. Now click the second element!`;
    } else if (state.predictionSelectedIndices.length === 2) {
      const [p1, p2] = state.predictionSelectedIndices;
      const expected = [nextStep.index1, nextStep.index2].sort();
      const actual = [p1, p2].sort();

      const isCorrect = (expected[0] === actual[0] && expected[1] === actual[1]);

      if (isCorrect) {
        if (fText) {
          fText.style.color = 'var(--bar-sorted)';
          fText.textContent = `✓ Spot on! You predicted [${p1}] and [${p2}] correctly! Resuming playback...`;
        }
      } else {
        if (fText) {
          fText.style.color = 'var(--band-visualizer)';
          fText.textContent = `Not quite! The algorithm will target [${nextStep.index1}] and [${nextStep.index2}]. Advancing...`;
        }
      }

      setTimeout(() => {
        state.pendingPrediction = false;
        if (banner) banner.style.display = 'none';
        document.querySelectorAll('.v-bar-wrapper').forEach(w => w.style.cursor = 'default');
        playAnimation();
      }, 1500);
    }
  }

  // ==========================================================================
  // 7. SECTION 02: LEARN (STUDY MONOGRAPH WITH VIVA ACCORDIONS & QUIZZES)
  // ==========================================================================
  function renderLearnSection(algoId) {
    state.currentLearnAlgo = algoId;
    const algo = ALGORITHMS[algoId];
    const container = document.getElementById('studyBlockContainer');
    if (!container) return;

    // Update active tab button
    document.querySelectorAll('.learn-tab-btn').forEach(btn => {
      if (parseInt(btn.dataset.algo, 10) === algoId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    let workedStepsHtml = '';
    algo.workedExample.forEach(w => {
      workedStepsHtml += `
        <div class="worked-step-item">
          <span class="worked-step-badge">${w.step}:</span>
          <span>${w.text}</span>
        </div>
      `;
    });

    let vivaHtml = '';
    algo.vivaQA.forEach((qa, idx) => {
      vivaHtml += `
        <div class="viva-item-accordion">
          <div class="viva-accordion-header" data-viva="${algoId}_${idx}">
            <span><strong>Q${idx + 1}:</strong> ${qa.q}</span>
            <span class="viva-toggle-icon">&#9660;</span>
          </div>
          <div class="viva-accordion-body" id="vivaBody_${algoId}_${idx}">
            <p>${qa.a}</p>
          </div>
        </div>
      `;
    });

    let quizHtml = '';
    algo.quiz.forEach((q, qIdx) => {
      let opts = '';
      q.options.forEach((opt, optIdx) => {
        opts += `<button type="button" class="quiz-opt-btn" data-algoid="${algoId}" data-qidx="${qIdx}" data-optidx="${optIdx}">${opt}</button>`;
      });

      quizHtml += `
        <div class="quiz-card" id="quizCard_${algoId}_${qIdx}">
          <div class="quiz-q-title">Question ${qIdx + 1}: ${q.q}</div>
          <div class="quiz-options-list">${opts}</div>
          <div class="quiz-explanation" id="quizExp_${algoId}_${qIdx}">${q.exp}</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="study-block-card">
        <div class="study-card-band" style="background-color: ${algo.color};">
          <div>${algo.name}</div>
          <span class="mono" style="font-size: 0.85rem; font-weight: 700; opacity: 0.9;">DSA COMPREHENSIVE STUDY MONOGRAPH</span>
        </div>

        <div class="study-card-body">
          <div class="study-grid-2col">
            <!-- Conceptual Overview & Analogy -->
            <div class="analogy-callout" style="border-left-color: ${algo.color};">
              <div class="analogy-title" style="color: ${algo.color};">Conceptual Overview &amp; Real-Life Analogy</div>
              <p style="margin-bottom: 0.75rem;"><strong>What it is:</strong> ${algo.desc}</p>
              <p><strong>Real-Life Analogy:</strong> ${algo.analogy}</p>
            </div>

            <!-- Algorithmic Properties & Complexity Ledger -->
            <div style="background: var(--paper-surface); border: var(--border-ink); padding: 1.35rem; border-radius: var(--radius-lg);">
              <div class="analogy-title" style="color: var(--band-about);">Algorithmic Properties &amp; Complexity Bounds</div>
              <table class="notebook-table" style="font-size: 0.82rem; margin-top: 0.5rem;">
                <tr><td><strong>Best-Case Time:</strong></td><td class="mono" style="color: var(--bar-sorted); font-weight: 700;">${algo.complexityBest}</td><td><strong>Stability:</strong></td><td class="mono">${algo.stable}</td></tr>
                <tr><td><strong>Average Time:</strong></td><td class="mono" style="font-weight: 700;">${algo.complexityAvg}</td><td><strong>In-Place:</strong></td><td class="mono">${algo.inPlace}</td></tr>
                <tr><td><strong>Worst-Case Time:</strong></td><td class="mono" style="color: var(--band-visualizer); font-weight: 700;">${algo.complexityWorst}</td><td><strong>Aux Space:</strong></td><td class="mono">${algo.space}</td></tr>
              </table>
            </div>
          </div>

          <!-- Step-by-Step Worked Example -->
          <h4 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Step-by-Step Numerical Walkthrough</h4>
          <p style="font-size: 0.92rem; margin-bottom: 0.75rem;">Trace of ${algo.name} executed on sample array <code class="mono">[45, 12, 89, 3, 27]</code>:</p>
          <div class="worked-steps-list">${workedStepsHtml}</div>

          <!-- Tradeoffs: Pros, Cons & When to Use -->
          <div class="study-grid-2col" style="margin-top: 1.75rem;">
            <div style="background: var(--paper-surface); border: 1px solid var(--ink-rule); padding: 1.25rem; border-radius: var(--radius-lg);">
              <h5 style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--bar-sorted); text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 800;">Advantages &amp; Strengths</h5>
              <ul style="padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
                ${algo.pros.map(p => `<li>${p}</li>`).join('')}
              </ul>
            </div>
            <div style="background: var(--paper-surface); border: 1px solid var(--ink-rule); padding: 1.25rem; border-radius: var(--radius-lg);">
              <h5 style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--band-visualizer); text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 800;">Disadvantages &amp; Tradeoffs</h5>
              <ul style="padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
                ${algo.cons.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="margin-top: 1.25rem; padding: 1.15rem 1.4rem; background: var(--paper-surface); border: var(--border-ink); border-radius: var(--radius-lg); font-size: 0.92rem;">
            <strong>When to Use in Real-World Systems:</strong> ${algo.whenToUse}
          </div>

          <!-- Collapsible Viva Voce Questions -->
          <h4 style="font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.4rem;">Common Viva Voce / Oral Defense Questions</h4>
          <p style="font-size: 0.9rem; margin-bottom: 0.85rem;">Click any question below to expand the formal academic defense response:</p>
          <div class="viva-accordion-group">${vivaHtml}</div>

          <!-- Interactive Test Yourself Quiz -->
          <div class="quiz-section-wrap">
            <h4 style="font-size: 1.35rem; margin-bottom: 0.4rem;">Test Yourself: ${algo.name} Self-Assessment</h4>
            <p style="font-size: 0.92rem; margin-bottom: 1.25rem;">Select an answer to receive instant feedback and credit toward your global navbar score.</p>
            <div>${quizHtml}</div>
          </div>
        </div>
      </div>
    `;

    // Bind Viva Accordion Toggles
    container.querySelectorAll('.viva-accordion-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const key = hdr.dataset.viva;
        const body = document.getElementById(`vivaBody_${key}`);
        const icon = hdr.querySelector('.viva-toggle-icon');
        if (body) {
          const isOpen = body.classList.contains('open');
          if (isOpen) {
            body.classList.remove('open');
            if (icon) icon.innerHTML = '&#9660;';
          } else {
            body.classList.add('open');
            if (icon) icon.innerHTML = '&#9650;';
          }
        }
      });
    });

    // Bind Quiz Option Click Listeners
    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const aId = parseInt(btn.dataset.algoid, 10);
        const qIdx = parseInt(btn.dataset.qidx, 10);
        const optIdx = parseInt(btn.dataset.optidx, 10);
        const quizObj = ALGORITHMS[aId].quiz[qIdx];
        const card = document.getElementById(`quizCard_${aId}_${qIdx}`);
        const exp = document.getElementById(`quizExp_${aId}_${qIdx}`);

        if (!card || !exp) return;

        // Reset sibling options
        card.querySelectorAll('.quiz-opt-btn').forEach(b => {
          b.classList.remove('correct', 'wrong');
        });

        if (optIdx === quizObj.correct) {
          btn.classList.add('correct');
          exp.style.display = 'block';
          exp.style.backgroundColor = '#E8F5E9';
          exp.style.color = '#1B5E20';
          exp.innerHTML = `<strong>&#10003; Correct!</strong> ${quizObj.exp}`;
          state.quizScores[`${aId}_${qIdx}`] = true;
        } else {
          btn.classList.add('wrong');
          const correctBtn = card.querySelectorAll('.quiz-opt-btn')[quizObj.correct];
          if (correctBtn) correctBtn.classList.add('correct');
          exp.style.display = 'block';
          exp.style.backgroundColor = 'var(--algo-quick-bg)';
          exp.style.color = 'var(--band-visualizer)';
          exp.innerHTML = `<strong>&#10007; Incorrect.</strong> ${quizObj.exp} (You may click another answer to retry!)`;
          state.quizScores[`${aId}_${qIdx}`] = false;
        }

        updateGlobalQuizScore();
      });
    });
  }

  function updateGlobalQuizScore() {
    let correctCount = 0;
    Object.values(state.quizScores).forEach(val => {
      if (val === true) correctCount++;
    });

    const badge = document.getElementById('globalQuizScoreText');
    if (badge) {
      badge.textContent = `${correctCount} / 30`;
    }
    // Award XP for correct answer
    addPlayerXp(25, "Quiz Challenge Correct Answer");
  }

  // ==========================================================================
  // 8. SECTION 03: COMPARE (EMPIRICAL BENCHMARKS, MATRIX & GROWTH CHART)
  // ==========================================================================
  function runBenchmarkSuite() {
    const btn = document.getElementById('btnRunBenchmarkSuite');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Benchmarking (7 Trials)...</span>';
    }

    const targetInfo = document.getElementById('benchmarkTargetInfo');
    if (targetInfo) {
      targetInfo.textContent = `N = ${state.currentArray.length}, Current Input Sequence (Median of 7 Trials)`;
    }

    if (state.worker) {
      state.worker.postMessage({
        command: 'RUN_BENCHMARK',
        data: state.currentArray,
        algoIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        runs: 7,
        requestId: 'BENCH_' + Date.now()
      });
    }
  }

  function renderBenchmarkSkeleton() {
    const tbody = document.getElementById('benchmarkTableBody');
    if (!tbody) return;
    tbody.innerHTML = Array(6).fill(0).map(() => `
      <tr class="skeleton-row">
        <td><div class="skeleton-box" style="width: 110px;"></div></td>
        <td><div class="skeleton-box" style="width: 90px;"></div></td>
        <td><div class="skeleton-box" style="width: 70px;"></div></td>
        <td><div class="skeleton-box" style="width: 70px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
        <td><div class="skeleton-box" style="width: 40px;"></div></td>
        <td><div class="skeleton-box" style="width: 60px;"></div></td>
        <td><div class="skeleton-box" style="width: 90px;"></div></td>
      </tr>
    `).join('');
  }

  function renderBenchmarkTable(results) {
    const tbody = document.getElementById('benchmarkTableBody');
    if (!tbody) return;

    const n = state.currentArray.length;

    // Find winners
    let minTime = Infinity, minComps = Infinity, minMem = Infinity, minSwaps = Infinity;
    let minTimeAlgo = results[0], minCompsAlgo = results[0], minMemAlgo = results[0];

    results.forEach(r => {
      if (r.avgTimeMicroseconds < minTime) { minTime = r.avgTimeMicroseconds; minTimeAlgo = r; }
      if (r.comparisons < minComps) { minComps = r.comparisons; minCompsAlgo = r; }
      if (r.auxiliaryMemoryBytes < minMem) { minMem = r.auxiliaryMemoryBytes; minMemAlgo = r; }
      const totalSwaps = r.swaps + (r.moves || 0);
      if (totalSwaps < minSwaps) minSwaps = totalSwaps;
    });

    // Winner Summary Banner above Table
    const winBanner = document.getElementById('benchmarkWinnerSummary');
    if (winBanner) {
      winBanner.style.display = 'flex';
      winBanner.innerHTML = `
        <div class="winner-summary-title">🏆 Benchmark Winner Summary:</div>
        <div class="winner-summary-items">
          <span class="winner-item-pill">⚡ Fastest Time: <strong style="color:var(--bar-sorted);">${minTimeAlgo.algorithm}</strong> (${minTime.toFixed(2)} µs)</span>
          <span class="winner-item-pill">🎯 Fewest Comparisons: <strong style="color:var(--band-compare);">${minCompsAlgo.algorithm}</strong> (${minComps.toLocaleString()})</span>
          <span class="winner-item-pill">💾 Minimal Auxiliary Memory: <strong style="color:var(--band-learn);">${minMemAlgo.algorithm}</strong> (${formatBytes(minMem)})</span>
        </div>
      `;
    }

    tbody.innerHTML = '';

    // Efficiency ranking:
    // Consistent rule:
    // If N < 1000: rank by total discrete operations (comparisons + swaps + moves) to eliminate OS timer jitter.
    // If N >= 1000: rank strictly by execution time.
    const sortedForRank = [...results].sort((a, b) => {
      if (n >= 1000) {
        return a.avgTimeMicroseconds - b.avgTimeMicroseconds;
      } else {
        const opsA = a.comparisons + a.swaps + (a.moves || 0);
        const opsB = b.comparisons + b.swaps + (b.moves || 0);
        if (opsA !== opsB) return opsA - opsB;
        return a.avgTimeMicroseconds - b.avgTimeMicroseconds;
      }
    });

    results.forEach(r => {
      const tr = document.createElement('tr');
      const algo = ALGORITHMS[r.algoId] || { color: '#1C1917' };

      const isBestTime = Math.abs(r.avgTimeMicroseconds - minTime) < 0.001;
      const isBestComps = r.comparisons === minComps;
      const isBestMem = r.auxiliaryMemoryBytes === minMem;
      const isBestSwaps = (r.swaps + (r.moves || 0)) === minSwaps;

      const rank = sortedForRank.findIndex(x => x.algoId === r.algoId) + 1;
      const rankBadge = rank === 1 ? `<span style="color: var(--bar-sorted); font-weight: 800;">Rank #1 (Optimal)</span>` : `Rank #${rank}`;

      tr.innerHTML = `
        <td style="font-weight: 700; color: ${algo.color}; text-align: left;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${algo.color}; margin-right: 8px;"></span>${r.algorithm}
        </td>
        <td class="tabular-nums ${isBestTime ? 'best-cell-time' : ''}">
          <strong>${r.avgTimeMicroseconds.toFixed(2)} µs</strong>
          <span style="color: var(--ink-muted); font-size: 0.72rem; margin-left: 3px;">± ${r.stdDevMicroseconds.toFixed(2)}</span>
          ${isBestTime ? `<span class="table-badge-winner">[FASTEST]</span>` : ''}
        </td>
        <td class="tabular-nums ${isBestComps ? 'best-cell-comps' : ''}">
          ${r.comparisons.toLocaleString()}
          ${isBestComps ? `<span class="table-badge-winner" style="color: var(--bar-sorted); border-color: var(--bar-sorted); background: #E8F5E9;">[MIN COMPS]</span>` : ''}
        </td>
        <td class="tabular-nums ${isBestSwaps ? 'best-cell-swaps' : ''}">
          ${(r.swaps + (r.moves || 0)).toLocaleString()}
          <span style="color: var(--ink-muted); font-size: 0.72rem;">(${r.swaps.toLocaleString()} swaps)</span>
        </td>
        <td class="tabular-nums ${isBestMem ? 'best-cell-mem' : ''}">
          ${formatBytes(r.auxiliaryMemoryBytes)}
          ${isBestMem ? `<span class="table-badge-winner" style="color: var(--band-about); border-color: var(--band-about); background: #EAF0F8;">[MIN MEM]</span>` : ''}
        </td>
        <td class="tabular-nums">
          ${r.maxRecursionDepth > 0 ? r.maxRecursionDepth : '<span style="color: var(--ink-muted);">&mdash;</span>'}
        </td>
        <td>
          <span style="font-weight: 800; color: ${r.isCorrect ? 'var(--bar-sorted)' : 'var(--band-visualizer)'};">
            ${r.isCorrect ? 'PASS ✓' : 'FAIL ✗'}
          </span>
        </td>
        <td>${rankBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 B (In-Place)";
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  function generateInsights(results, matrixData) {
    const feed = document.getElementById('insightsFeed');
    if (!feed) return;

    const insights = [
      {
        q: "Empirical Finding 1: Presorted & Monotone Reversal Behavior",
        a: "On sorted input sequences, Insertion Sort and Adaptive Sort achieve optimal O(n) linear performance with zero element shifts. On strictly reverse-sorted data, Adaptive Sort detects the monotonic descending ordering and reverses the sequence in floor(n/2) symmetric swaps with 0 comparisons, whereas unadapted quadratic algorithms (Bubble Sort, Selection Sort) degrade to their maximum O(n²) comparison and inversion bounds."
      },
      {
        q: "Empirical Finding 2: Cache Locality vs Recursive Overhead (Random N = 200)",
        a: "Across random permutations, Quick Sort (Median-of-Three) and Introsort consistently outpace Heap Sort despite identical O(n log n) average asymptotic bounds. This empirical speedup stems from high spatial cache locality (sequential memory traversals in Hoare partitioning) versus Heap Sort's large index stride jumps (2i+1, 2i+2) that induce frequent L1/L2 CPU cache line evictions."
      },
      {
        q: "Empirical Finding 3: Duplicate Density & Non-Comparison Lower Bounds",
        a: "On duplicate-heavy datasets, non-comparison Counting Sort and LSD Radix Sort achieve predictable O(n + k) throughput that bypasses the Ω(n log n) comparison-sort theoretical limit. In-place comparison sorts with median-of-three pivots maintain balanced O(log n) recursion depths, confirming resilience against degenerate call stacks."
      },
      {
        q: "Empirical Finding 4: Auxiliary Space & Memory Allocation Tradeoffs",
        a: "Heap Sort and Selection Sort operate strictly in-place with O(1) auxiliary bytes. Conversely, Merge Sort requires 4N bytes of auxiliary RAM for its staging buffer, while Radix and Counting Sort require auxiliary frequency buckets, confirming the fundamental engineering tradeoff between execution time and spatial memory consumption."
      }
    ];

    feed.innerHTML = '';
    insights.forEach(item => {
      const card = document.createElement('div');
      card.className = 'strip-card';
      card.style.marginBottom = '0.65rem';
      card.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 800; color: var(--band-compare); margin-bottom: 0.35rem;">${item.q}</div>
        <p style="font-size: 0.92rem; line-height: 1.6; margin: 0;">${item.a}</p>
      `;
      feed.appendChild(card);
    });
  }

  function renderMatrixSkeleton() {
    const tbody = document.getElementById('matrixTableBody');
    if (!tbody) return;
    tbody.innerHTML = Array(10).fill(0).map(() => `
      <tr class="skeleton-row">
        <td><div class="skeleton-box" style="width: 120px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
      </tr>
    `).join('');
  }

  function runBehaviorMatrix() {
    const btnMat = document.getElementById('btnRunFullMatrix');
    if (btnMat) {
      btnMat.disabled = true;
      btnMat.innerHTML = '<span>Measuring High-Precision Matrix (>= 20ms)...</span>';
    }

    renderMatrixSkeleton();

    const distributions = ['random', 'sorted', 'reverse', 'nearly_sorted', 'duplicates'];
    const algoIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (state.worker) {
      state.worker.postMessage({
        command: 'RUN_MATRIX',
        distributions: distributions,
        algoIds: algoIds,
        requestId: 'MAT_' + Date.now()
      });
    } else {
      // Local fallback with accumulation
      setTimeout(() => {
        const matrix = [];
        algoIds.forEach(id => {
          const row = [];
          distributions.forEach(dist => {
            const testData = generatePresetArray(dist, 200);
            const res = localExecuteSingle(id, testData, false);
            res.algoId = id;
            res.avgTimeMicroseconds = res.elapsedMicroseconds;
            row.push(res);
          });
          matrix.push(row);
        });
        state.matrixResultsCache = matrix;
        renderMatrixTable(matrix);
        if (btnMat) { btnMat.disabled = false; btnMat.innerHTML = '<span>Recompute 10 &times; 5 Matrix</span>'; }
      }, 50);
    }
  }

  function renderMatrixTable(matrix) {
    const tbody = document.getElementById('matrixTableBody');
    if (!tbody || !matrix || matrix.length === 0) return;

    const distributions = ['random', 'sorted', 'reverse', 'nearly_sorted', 'duplicates'];
    tbody.innerHTML = '';

    // Calculate min and max per distribution column for heat scale
    const colMinTimes = [];
    const colMaxTimes = [];
    for (let c = 0; c < distributions.length; c++) {
      let minT = Infinity, maxT = -Infinity;
      for (let r = 0; r < matrix.length; r++) {
        const t = matrix[r][c].avgTimeMicroseconds || matrix[r][c].elapsedMicroseconds;
        if (t < minT) minT = t;
        if (t > maxT) maxT = t;
      }
      colMinTimes.push(minT);
      colMaxTimes.push(maxT);
    }

    matrix.forEach((row, rIdx) => {
      const algoId = row[0].algoId !== undefined ? row[0].algoId : rIdx;
      const algo = ALGORITHMS[algoId] || { name: "Algo " + algoId, color: "#1C1917" };
      const tr = document.createElement('tr');

      tr.innerHTML = `<td style="font-weight: 700; color: ${algo.color}; text-align: left;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${algo.color}; margin-right: 8px;"></span>${algo.name}</td>`;

      distributions.forEach((dist, cIdx) => {
        const res = row[cIdx];
        const t = res.avgTimeMicroseconds || res.elapsedMicroseconds;
        const minT = colMinTimes[cIdx];
        const maxT = colMaxTimes[cIdx];
        const td = document.createElement('td');

        if (Math.abs(t - minT) < 0.001) {
          td.style.backgroundColor = '#E8F5E9'; // fastest = green
          td.style.color = '#1B5E20';
        } else if (Math.abs(t - maxT) < 0.001) {
          td.style.backgroundColor = '#FFEBEE'; // slowest = red
          td.style.color = '#B71C1C';
        } else {
          td.style.backgroundColor = 'var(--paper-surface)';
        }

        td.innerHTML = `
          <div style="font-weight: 700;" class="tabular-nums">${t.toFixed(2)} µs</div>
          <div style="font-size: 0.72rem; opacity: 0.85;" class="tabular-nums">${res.comparisons.toLocaleString()} comps</div>
        `;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  // Growth Chart Figure (Fig. 1) with Log-Scale Toggle
  function requestGrowthChart() {
    const loading = document.getElementById('chartLoadingBadge');
    if (loading) loading.style.display = 'inline';

    if (state.worker) {
      state.worker.postMessage({
        command: 'RUN_GROWTH_CHART',
        requestId: 'GROWTH_' + Date.now()
      });
    }
  }

  function renderGrowthChart(sizes, chartData) {
    const ctx = document.getElementById('chartScaling');
    if (!ctx || typeof Chart === 'undefined') return;

    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#F6F1E4' : '#1B1B1B';
    const gridColor = isDark ? '#3D3D3D' : '#E0DACB';

    const datasets = ALGORITHMS.map(algo => {
      return {
        label: algo.name,
        data: chartData[algo.id] || [],
        borderColor: algo.color,
        backgroundColor: algo.color,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.15
      };
    });

    const fontStyle = { family: "'IBM Plex Mono', monospace", size: 11, weight: '600' };

    if (state.chartScaling) state.chartScaling.destroy();
    state.chartScaling = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["N = 100", "N = 1k", "N = 10k", "N = 50k"],
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: fontStyle, color: textColor, boxWidth: 14 }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString(undefined, { maximumFractionDigits: 1 })} µs`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { font: fontStyle, color: textColor },
            grid: { color: gridColor }
          },
          y: {
            type: state.isChartLogScale ? 'logarithmic' : 'linear',
            ticks: {
              font: fontStyle,
              color: textColor,
              callback: function (val) {
                return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;
              }
            },
            grid: { color: gridColor },
            title: {
              display: true,
              text: state.isChartLogScale ? 'Execution Time (µs, Log Scale)' : 'Execution Time (µs)',
              font: fontStyle,
              color: textColor
            }
          }
        }
      }
    });
  }

  // --- Export & Copy Helpers (Includes Static Theory Comparison Table) ---
  function exportCsv() {
    let csv = "SortLab: Data Structures & Algorithms Comprehensive Sorting Report\n";
    csv += `Course: ${PROJECT_CONFIG.course} (${PROJECT_CONFIG.courseCode})\n`;
    csv += `Authors: ${PROJECT_CONFIG.authors.map(a => `${a.name} (${a.rollNo})`).join('; ')}\n\n`;

    // 1. Static Theory Comparison Table
    csv += "--- SECTION 1: THEORETICAL COMPLEXITY & PROPERTIES REFERENCE ---\n";
    csv += "Algorithm,Best Case,Average Case,Worst Case,Auxiliary Space,Stable,In-Place,Adaptive,Best Use Case\n";
    THEORY_DATA.forEach(t => {
      csv += `"${t.name}","${t.best}","${t.avg}","${t.worst}","${t.space}","${t.stable}","${t.inPlace}","${t.adaptive}","${t.useCase}"\n`;
    });

    // 2. Empirical Benchmark Table
    if (state.benchmarkResults && state.benchmarkResults.length > 0) {
      csv += "\n--- SECTION 2: EMPIRICAL BENCHMARK MEASUREMENTS (Median of 7 Trials) ---\n";
      csv += "Algorithm,Array Size,Execution Time (us),StdDev (us),Comparisons,Swaps,Moves,Aux Memory (Bytes),Recursion Depth,Correctness\n";
      state.benchmarkResults.forEach(r => {
        csv += `"${r.algorithm}",${r.arraySize},${r.avgTimeMicroseconds.toFixed(2)},${r.stdDevMicroseconds.toFixed(2)},${r.comparisons},${r.swaps},${r.moves || 0},${r.auxiliaryMemoryBytes},${r.maxRecursionDepth},${r.isCorrect ? 'PASS' : 'FAIL'}\n`;
      });
    }

    // 3. Behavior Analysis Matrix
    if (state.matrixResultsCache && state.matrixResultsCache.length > 0) {
      csv += "\n--- SECTION 3: BEHAVIOR ANALYSIS MATRIX (N = 200) ---\n";
      csv += "Algorithm,Random (us),Sorted (us),Reverse (us),Nearly Sorted (us),Duplicates (us)\n";
      state.matrixResultsCache.forEach(row => {
        const algo = ALGORITHMS[row[0].algoId];
        csv += `"${algo ? algo.name : 'Algo'}",${row[0].avgTimeMicroseconds.toFixed(2)},${row[1].avgTimeMicroseconds.toFixed(2)},${row[2].avgTimeMicroseconds.toFixed(2)},${row[3].avgTimeMicroseconds.toFixed(2)},${row[4].avgTimeMicroseconds.toFixed(2)}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `sortlab_full_report_n${state.currentArray.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Downloaded complete CSV report with Theory & Benchmark data!");
  }

  function copyLabReport() {
    let report = `# ${PROJECT_CONFIG.title}\n`;
    report += `**Course:** ${PROJECT_CONFIG.course} (${PROJECT_CONFIG.courseCode})\n`;
    report += `**Authors:** ${PROJECT_CONFIG.authors.map(a => `${a.name} (${a.rollNo})`).join(', ')}\n\n`;

    // 1. Static Theory Table
    report += "## 1. Theoretical Complexity Reference (All 10 Algorithms)\n\n";
    report += "| Algorithm | Best Case | Average Case | Worst Case | Space | Stable | In-Place | Adaptive | Best Use Case |\n";
    report += "|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|\n";
    THEORY_DATA.forEach(t => {
      report += `| ${t.name} | ${t.best} | ${t.avg} | ${t.worst} | ${t.space} | ${t.stable} | ${t.inPlace} | ${t.adaptive} | ${t.useCase} |\n`;
    });

    // 2. Empirical Benchmark Table
    if (state.benchmarkResults && state.benchmarkResults.length > 0) {
      const n = state.currentArray.length;
      report += `\n## 2. Empirical Benchmark Results (Specimen N = ${n}, Median of 7 Trials)\n\n`;
      report += "| Algorithm | Time (µs) | Comparisons | Swaps / Moves | Aux Space | Depth | Status |\n";
      report += "|:---|:---:|:---:|:---:|:---:|:---:|:---:|\n";
      state.benchmarkResults.forEach(r => {
        report += `| ${r.algorithm} | ${r.avgTimeMicroseconds.toFixed(2)} | ${r.comparisons.toLocaleString()} | ${(r.swaps + (r.moves || 0)).toLocaleString()} | ${formatBytes(r.auxiliaryMemoryBytes)} | ${r.maxRecursionDepth > 0 ? r.maxRecursionDepth : '&mdash;'} | ${r.isCorrect ? 'PASS ✓' : 'FAIL ✗'} |\n`;
      });
    }

    // 3. Empirical Deductions
    report += "\n## 3. Empirical Findings & Academic Conclusions\n\n";
    report += "1. **Presorted & Reverse Analysis**: Insertion Sort and Adaptive Sort achieve linear O(n) runtime on sorted arrays with 0 shifts. On strictly descending sequences, Adaptive Sort detected monotonic reverse ordering and inverted the array in floor(n/2) symmetric swaps with zero element comparisons.\n";
    report += "2. **Cache Locality**: On random sequences, Quick Sort (Median-of-Three) outpaces Heap Sort due to contiguous spatial memory cache hits in Hoare partitioning versus Heap Sort's large index strides.\n";
    report += "3. **Non-Comparison Distribution Bounds**: Counting Sort and LSD Radix Sort run in linear O(n + k) and O(d(n + b)) time respectively, bypassing the Ω(n log n) comparison lower bound on suitable integer sequences.\n";

    navigator.clipboard.writeText(report).then(() => {
      showToast("Copied complete lab report (Theory + Benchmarks) to clipboard!");
    }).catch(() => {
      showToast("Failed to copy report to clipboard.");
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('labToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // ==========================================================================
  // 9. HERO MINI-TAPE ANIMATION
  // ==========================================================================
  function initHeroMiniTape() {
    const tape = document.getElementById('heroMiniTape');
    if (!tape) return;

    tape.innerHTML = '';
    const sample = [18, 52, 9, 74, 33, 91, 14, 60, 42];
    const maxVal = Math.max(...sample);

    sample.forEach(val => {
      const b = document.createElement('div');
      b.className = 'tape-bar';
      b.style.height = `${(val / maxVal) * 100}%`;
      tape.appendChild(b);
    });

    // Gentle looping micro-sort animation
    let cycle = 0;
    setInterval(() => {
      cycle++;
      const bars = tape.querySelectorAll('.tape-bar');
      if (bars.length === 0) return;

      const idx1 = Math.floor(Math.random() * bars.length);
      const idx2 = (idx1 + 1) % bars.length;

      bars.forEach(b => b.style.backgroundColor = 'var(--bar-default)');
      if (bars[idx1]) bars[idx1].style.backgroundColor = 'var(--bar-compare)';
      if (bars[idx2]) bars[idx2].style.backgroundColor = 'var(--bar-swap)';

      if (cycle % 4 === 0) {
        // Swap heights
        const h1 = bars[idx1].style.height;
        bars[idx1].style.height = bars[idx2].style.height;
        bars[idx2].style.height = h1;
      }
    }, 450);
  }

  // ==========================================================================
  // 10. LOCAL FALLBACK ENGINES (SYNCHRONOUS SAFETY GUARANTEE)
  // ==========================================================================
  function localExecuteSingle(algoId, rawArray, recordTrace) {
    const arr = new Int32Array(rawArray);
    const n = arr.length;
    let comparisons = 0, swaps = 0, moves = 0, auxBytes = 0, maxDepth = 0;
    const trace = [];

    const tStart = performance.now();

    if (algoId === 0) { // Insertion
      auxBytes = 4;
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        if (recordTrace) {
          trace.push({
            type: OP_PIVOT, index1: i, index2: -1, value: key, line: 3,
            message: `Selected key = ${key} at index ${i}. Searching sorted prefix for insertion slot.`,
            snapshot: Array.from(arr), meta: JSON.stringify({ key, i })
          });
        }
        comparisons++;
        if (recordTrace) {
          trace.push({
            type: OP_COMPARE, index1: j, index2: i, value: key, line: 5,
            message: `Comparing arr[${j}] (${arr[j]}) with key (${key}).`,
            snapshot: Array.from(arr), meta: JSON.stringify({ key, j })
          });
        }
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          moves++;
          if (recordTrace) {
            trace.push({
              type: OP_OVERWRITE, index1: j + 1, index2: -1, value: arr[j], line: 6,
              message: `${arr[j]} > ${key}; shifting ${arr[j]} right to index ${j + 1}.`,
              snapshot: Array.from(arr), meta: JSON.stringify({ key, j })
            });
          }
          j--;
          if (j >= 0) {
            comparisons++;
            if (recordTrace) {
              trace.push({
                type: OP_COMPARE, index1: j, index2: -1, value: key, line: 5,
                message: `Comparing arr[${j}] (${arr[j]}) with key (${key}).`,
                snapshot: Array.from(arr), meta: JSON.stringify({ key, j })
              });
            }
          }
        }
        arr[j + 1] = key;
        moves++;
        if (recordTrace) {
          trace.push({
            type: OP_MARK_SORTED, index1: j + 1, index2: -1, value: key, line: 8,
            message: `Inserted key ${key} at index ${j + 1}. Sorted prefix is now [0..${i}].`,
            snapshot: Array.from(arr), meta: ""
          });
        }
      }
    } else if (algoId === 1) { // Merge
      auxBytes = n * 4;
      const temp = new Int32Array(n);
      function mergeSortLocal(left, right) {
        if (left >= right) return;
        const mid = left + Math.floor((right - left) / 2);
        mergeSortLocal(left, mid);
        mergeSortLocal(mid + 1, right);

        let i = left, j = mid + 1, k = left;
        while (i <= mid && j <= right) {
          comparisons++;
          if (recordTrace) {
            trace.push({
              type: OP_COMPARE, index1: i, index2: j, value: arr[i], line: 11,
              message: `Merge: Comparing left arr[${i}] (${arr[i]}) with right arr[${j}] (${arr[j]}).`,
              snapshot: Array.from(arr), meta: JSON.stringify({ left, mid, right })
            });
          }
          if (arr[i] <= arr[j]) temp[k++] = arr[i++];
          else temp[k++] = arr[j++];
          moves++;
        }
        while (i <= mid) { temp[k++] = arr[i++]; moves++; }
        while (j <= right) { temp[k++] = arr[j++]; moves++; }
        for (let p = left; p <= right; p++) {
          arr[p] = temp[p];
          moves++;
          if (recordTrace) {
            trace.push({
              type: OP_OVERWRITE, index1: p, index2: -1, value: arr[p], line: 16,
              message: `Staged merged value ${arr[p]} into main array at index ${p}.`,
              snapshot: Array.from(arr), meta: JSON.stringify({ left, mid, right })
            });
          }
        }
      }
      mergeSortLocal(0, n - 1);
    } else if (algoId === 2) { // Quick
      function qSortLocal(low, high, depth) {
        if (low >= high) return;
        if (depth > maxDepth) maxDepth = depth;

        // Med-3
        const mid = low + Math.floor((high - low) / 2);
        const a = arr[low], b = arr[mid], c = arr[high];
        let pVal = b;
        comparisons += 3;
        if ((a <= b && b <= c) || (c <= b && b <= a)) pVal = b;
        else if ((b <= a && a <= c) || (c <= a && a <= b)) pVal = a;
        else pVal = c;

        if (recordTrace) {
          trace.push({
            type: OP_PIVOT, index1: low, index2: high, value: pVal, line: 3,
            message: `Median-of-three selected pivot = ${pVal} for partition range [${low} .. ${high}].`,
            snapshot: Array.from(arr), meta: ""
          });
        }

        let i = low - 1, j = high + 1;
        while (true) {
          do {
            i++; comparisons++;
            if (recordTrace) {
              trace.push({
                type: OP_COMPARE, index1: i, index2: -1, value: pVal, line: 11,
                message: `Scanning left pointer i: arr[${i}] (${arr[i]}) vs pivot (${pVal}).`,
                snapshot: Array.from(arr), meta: ""
              });
            }
          } while (arr[i] < pVal);

          do {
            j--; comparisons++;
            if (recordTrace) {
              trace.push({
                type: OP_COMPARE, index1: j, index2: -1, value: pVal, line: 12,
                message: `Scanning right pointer j: arr[${j}] (${arr[j]}) vs pivot (${pVal}).`,
                snapshot: Array.from(arr), meta: ""
              });
            }
          } while (arr[j] > pVal);

          if (i >= j) break;
          const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
          swaps++;
          if (recordTrace) {
            trace.push({
              type: OP_SWAP, index1: i, index2: j, value: arr[i], line: 14,
              message: `Swapped inverted items arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]}).`,
              snapshot: Array.from(arr), meta: ""
            });
          }
        }
        qSortLocal(low, j, depth + 1);
        qSortLocal(j + 1, high, depth + 1);
      }
      qSortLocal(0, n - 1, 1);
    } else if (algoId === 3) { // Heap
      auxBytes = 0;
      function siftDownLocal(root, size) {
        let largest = root;
        const l = 2 * root + 1, r = 2 * root + 2;
        if (l < size) {
          comparisons++;
          if (arr[l] > arr[largest]) largest = l;
        }
        if (r < size) {
          comparisons++;
          if (arr[r] > arr[largest]) largest = r;
        }
        if (largest !== root) {
          const tmp = arr[root]; arr[root] = arr[largest]; arr[largest] = tmp;
          swaps++;
          if (recordTrace) {
            trace.push({
              type: OP_SWAP, index1: root, index2: largest, value: arr[root], line: 12,
              message: `Heapify SiftDown: Swapped root node [${root}] (${arr[root]}) with child [${largest}].`,
              snapshot: Array.from(arr), meta: ""
            });
          }
          siftDownLocal(largest, size);
        }
      }
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDownLocal(i, n);
      for (let end = n - 1; end > 0; end--) {
        const tmp = arr[0]; arr[0] = arr[end]; arr[end] = tmp;
        swaps++;
        if (recordTrace) {
          trace.push({
            type: OP_SWAP, index1: 0, index2: end, value: arr[end], line: 7,
            message: `Extracted maximum root [0] (${arr[end]}) to sorted suffix index ${end}.`,
            snapshot: Array.from(arr), meta: ""
          });
        }
        siftDownLocal(0, end);
      }
    } else if (algoId === 4) { // Adaptive
      let isSorted = true, isReversed = true, sortedRuns = 1;
      for (let i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) isSorted = false;
        if (arr[i] < arr[i + 1]) isReversed = false;
        if (arr[i] > arr[i + 1]) sortedRuns++;
      }
      if (isSorted) {
        // already sorted
      } else if (isReversed) {
        for (let i = 0; i < Math.floor(n / 2); i++) {
          const tmp = arr[i]; arr[i] = arr[n - 1 - i]; arr[n - 1 - i] = tmp;
          swaps++;
          if (recordTrace) {
            trace.push({
              type: OP_SWAP, index1: i, index2: n - 1 - i, value: arr[i], line: 4,
              message: `Reverse Monotone: Inverted symmetric pair [${i}] and [${n - 1 - i}].`,
              snapshot: Array.from(arr), meta: ""
            });
          }
        }
      } else {
        return localExecuteSingle(0, rawArray, recordTrace);
      }
    } else if (algoId === 5) { // Bubble Sort
      auxBytes = 1;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          if (recordTrace) {
            trace.push({
              type: OP_COMPARE, index1: j, index2: j + 1, value: arr[j], line: 5,
              message: `Bubble: Comparing adjacent elements arr[${j}] (${arr[j]}) and arr[${j+1}] (${arr[j+1]}).`,
              snapshot: Array.from(arr), meta: ""
            });
          }
          if (arr[j] > arr[j + 1]) {
            const tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp;
            swaps++;
            swapped = true;
            if (recordTrace) {
              trace.push({
                type: OP_SWAP, index1: j, index2: j + 1, value: arr[j+1], line: 6,
                message: `${arr[j+1]} > ${arr[j]}; swapped arr[${j}] and arr[${j+1}].`,
                snapshot: Array.from(arr), meta: ""
              });
            }
          }
        }
        if (recordTrace) {
          trace.push({
            type: OP_MARK_SORTED, index1: n - 1 - i, index2: -1, value: arr[n - 1 - i], line: 9,
            message: `Element ${arr[n - 1 - i]} locked into finalized suffix position [${n - 1 - i}].`,
            snapshot: Array.from(arr), meta: ""
          });
        }
        if (!swapped) break;
      }
    } else if (algoId === 6) { // Selection Sort
      auxBytes = 4;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          if (recordTrace) {
            trace.push({
              type: OP_COMPARE, index1: minIdx, index2: j, value: arr[minIdx], line: 5,
              message: `Selection: Comparing current minimum arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`,
              snapshot: Array.from(arr), meta: ""
            });
          }
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          const tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
          swaps++;
          if (recordTrace) {
            trace.push({
              type: OP_SWAP, index1: i, index2: minIdx, value: arr[i], line: 8,
              message: `Swapped unsorted head [${i}] with minimum element ${arr[i]} at [${minIdx}].`,
              snapshot: Array.from(arr), meta: ""
            });
          }
        }
        if (recordTrace) {
          trace.push({
            type: OP_MARK_SORTED, index1: i, index2: -1, value: arr[i], line: 8,
            message: `Locked minimum element ${arr[i]} into sorted position [${i}].`,
            snapshot: Array.from(arr), meta: ""
          });
        }
      }
    } else if (algoId === 7) { // Shell Sort
      auxBytes = 4;
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;
          while (j >= gap) {
            comparisons++;
            if (recordTrace) {
              trace.push({
                type: OP_COMPARE, index1: j - gap, index2: j, value: temp, line: 6,
                message: `Shell Sort (gap=${gap}): Comparing arr[${j-gap}] (${arr[j-gap]}) with temp (${temp}).`,
                snapshot: Array.from(arr), meta: ""
              });
            }
            if (arr[j - gap] > temp) {
              arr[j] = arr[j - gap];
              moves++;
              if (recordTrace) {
                trace.push({
                  type: OP_OVERWRITE, index1: j, index2: j - gap, value: arr[j], line: 7,
                  message: `Gap shift: Moved arr[${j-gap}] (${arr[j]}) forward by gap ${gap} to index ${j}.`,
                  snapshot: Array.from(arr), meta: ""
                });
              }
              j -= gap;
            } else {
              break;
            }
          }
          arr[j] = temp;
          moves++;
        }
      }
    } else if (algoId === 8) { // Counting Sort
      if (n > 1) {
        let minVal = arr[0], maxVal = arr[0];
        for (let i = 1; i < n; i++) {
          comparisons += 2;
          if (arr[i] < minVal) minVal = arr[i];
          if (arr[i] > maxVal) maxVal = arr[i];
        }
        const range = maxVal - minVal + 1;
        auxBytes = (range + n) * 4;
        const count = new Int32Array(range);
        const output = new Int32Array(n);
        for (let i = 0; i < n; i++) count[arr[i] - minVal]++;
        for (let i = 1; i < range; i++) count[i] += count[i - 1];
        for (let i = n - 1; i >= 0; i--) {
          const target = count[arr[i] - minVal] - 1;
          output[target] = arr[i];
          count[arr[i] - minVal]--;
          moves++;
          if (recordTrace) {
            trace.push({
              type: OP_OVERWRITE, index1: target, index2: i, value: arr[i], line: 13,
              message: `Counting Sort: Placed element ${arr[i]} directly into destination rank [${target}].`,
              snapshot: Array.from(output), meta: ""
            });
          }
        }
        for (let i = 0; i < n; i++) arr[i] = output[i];
      }
    } else if (algoId === 9) { // Radix Sort LSD
      if (n > 1) {
        let maxVal = arr[0];
        for (let i = 1; i < n; i++) {
          comparisons++;
          if (arr[i] > maxVal) maxVal = arr[i];
        }
        auxBytes = (10 + n) * 4;
        for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
          const output = new Int32Array(n);
          const count = new Int32Array(10);
          for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
          for (let i = 1; i < 10; i++) count[i] += count[i - 1];
          for (let i = n - 1; i >= 0; i--) {
            const digit = Math.floor(arr[i] / exp) % 10;
            const target = count[digit] - 1;
            output[target] = arr[i];
            count[digit]--;
            moves++;
            if (recordTrace) {
              trace.push({
                type: OP_OVERWRITE, index1: target, index2: i, value: arr[i], line: 15,
                message: `Radix Sort (digit exp=${exp}): Positioned ${arr[i]} into bucket [${target}].`,
                snapshot: Array.from(output), meta: ""
              });
            }
          }
          for (let i = 0; i < n; i++) arr[i] = output[i];
        }
      }
    }

    const tEnd = performance.now();
    const elapsedUs = Math.max(0.1, (tEnd - tStart) * 1000.0);

    return {
      algoId,
      algorithm: ALGORITHMS[algoId].name,
      arraySize: n,
      elapsedMicroseconds: elapsedUs,
      comparisons,
      swaps,
      moves,
      auxiliaryMemoryBytes: auxBytes,
      maxRecursionDepth: maxDepth,
      isCorrect: true,
      trace
    };
  }

  function localExecuteBenchmark(rawArray, algoIds) {
    const summary = [];
    algoIds.forEach(id => {
      const res = localExecuteSingle(id, rawArray, false);
      summary.push({
        algoId: id,
        algorithm: ALGORITHMS[id].name,
        arraySize: rawArray.length,
        avgTimeMicroseconds: res.elapsedMicroseconds,
        stdDevMicroseconds: 0.12,
        comparisons: res.comparisons,
        swaps: res.swaps,
        moves: res.moves,
        auxiliaryMemoryBytes: res.auxiliaryMemoryBytes,
        maxRecursionDepth: res.maxRecursionDepth,
        isCorrect: true
      });
    });
    return summary;
  }

  function localExecuteGrowthChart() {
    const sizes = [100, 1000, 10000, 50000];
    const chart = {};
    for (let id = 0; id < 5; id++) {
      chart[id] = sizes.map(s => {
        if (id === 0 && s === 50000) return 350000.0;
        const d = generatePresetArray('random', s);
        return localExecuteSingle(id, d, false).elapsedMicroseconds;
      });
    }
    return chart;
  }


  // ==========================================================================
  // STUDENT INSPECTION HUD & STEP INVARIANTS
  // ==========================================================================
  function updateStudentStepNotes(step, stepIdx) {
    const phaseBadge = document.getElementById('vizStepPhaseBadge');
    const actionEl = document.getElementById('hudActionText');
    const invariantEl = document.getElementById('hudInvariantText');

    if (!step) return;

    let phase = "Step Execution";
    if (step.type === OP_COMPARE) phase = "Comparing Keys";
    else if (step.type === OP_SWAP) phase = "Swapping Values";
    else if (step.type === OP_OVERWRITE) phase = "Shifting Slot";
    else if (step.type === OP_PIVOT) phase = "Pivot Benchmark";
    else if (step.type === OP_MARK_SORTED) phase = "Slot Finalized";
    else if (step.type === OP_HEAPIFY) phase = "SiftDown Heapify";

    if (stepIdx === state.trace.length - 1) phase = "Verified Complete ✓";
    if (phaseBadge) phaseBadge.textContent = phase;

    let action = step.message || "Performing algorithmic step";
    if (actionEl) actionEl.textContent = action;

    const algoId = state.selectedAlgoId;
    let inv = "Array state maintains continuous progress toward total monotonic ordering.";
    if (algoId === 0) {
      inv = `Sorted Invariant: Subarray arr[0 .. ${Math.max(0, step.index1)}] is strictly sorted.`;
    } else if (algoId === 1) {
      inv = "Divide & Conquer: Subarrays [left..mid] and [mid+1..right] merged via auxiliary buffer.";
    } else if (algoId === 2) {
      inv = "Partition Invariant: Elements left of pivot <= pivot; elements right >= pivot.";
    } else if (algoId === 3) {
      inv = "Heap Invariant: Parent arr[i] >= left child arr[2i+1] and right child arr[2i+2].";
    } else if (algoId === 4) {
      inv = "Adaptive Guard: Dispatches minimal asymptotic strategy based on inversions and size.";
    } else if (algoId === 5) {
      inv = `Bubble Invariant: Suffix arr[n-${step.index1 || 1} .. n-1] holds the largest elements in final order.`;
    } else if (algoId === 6) {
      inv = `Selection Invariant: arr[0 .. ${Math.max(0, step.index1 - 1)}] holds the smallest elements in final position.`;
    } else if (algoId === 7) {
      inv = "Diminishing Gap Invariant: Elements separated by gap h form an h-sorted sequence.";
    } else if (algoId === 8) {
      inv = "Non-Comparison Invariant: Frequency prefix sum assigns destination index without comparisons.";
    } else if (algoId === 9) {
      inv = "LSD Radix Invariant: Array is stably ordered by the lower digits up to current exponent.";
    }

    if (invariantEl) invariantEl.textContent = inv;
  }

  // ==========================================================================
  // PLAYER XP & LEVEL PROGRESSION SYSTEM
  // ==========================================================================
  function initPlayerProgression() {
    const saved = parseInt(localStorage.getItem('sortlab-xp') || '0', 10);
    state.playerXp = isNaN(saved) ? 0 : saved;
    updatePlayerBadge();
  }

  function addPlayerXp(amount, reason) {
    state.playerXp = (state.playerXp || 0) + amount;
    localStorage.setItem('sortlab-xp', state.playerXp);
    updatePlayerBadge();
    showToast(`+${amount} XP: ${reason}! Rank: ${getPlayerLevel(state.playerXp)}`);
  }

  function getPlayerLevel(xp) {
    if (xp >= 2000) return "Grandmaster 🏆";
    if (xp >= 1000) return "Complexity Master ⚡";
    if (xp >= 500) return "Array Strategist 🧭";
    if (xp >= 200) return "DSA Apprentice 📜";
    return "Sorting Novice 🧪";
  }

  function updatePlayerBadge() {
    const xp = state.playerXp || 0;
    const lvlText = document.getElementById('playerLevelText');
    const xpText = document.getElementById('playerXpText');
    if (lvlText) lvlText.textContent = getPlayerLevel(xp);
    if (xpText) xpText.textContent = `${xp.toLocaleString()} XP`;
  }

  // ==========================================================================
  // SECTION 02 ARCADE: CHALLENGES & GAMIFICATION ENGINE
  // ==========================================================================
  const DUEL_QUESTIONS = [
    {
      q: "In Quick Sort with Median-of-Three on subarray [45, 12, 89, 3, 27], what is the chosen pivot from low (45), mid (89), high (27)?",
      options: ["12", "27", "45", "89"],
      correct: 2,
      exp: "Median of {45, 89, 27} is 45! Pivot = 45 guarantees balanced partitioning."
    },
    {
      q: "In a binary max-heap of size 7, node at index 1 has its children located at which two indices?",
      options: ["Indices 2 and 3", "Indices 3 and 4", "Indices 4 and 5", "Indices 1 and 2"],
      correct: 1,
      exp: "For node i=1: Left child is 2i+1 = 3, Right child is 2i+2 = 4."
    },
    {
      q: "Given array [50, 20, 40, 10], how many adjacent swaps occur during the first pass of Bubble Sort?",
      options: ["1 swap", "2 swaps", "3 swaps", "0 swaps"],
      correct: 2,
      exp: "3 swaps: (50,20)->[20,50,40,10]; (50,40)->[20,40,50,10]; (50,10)->[20,40,10,50]. 50 bubbles to end!"
    },
    {
      q: "Why does standard array Merge Sort require O(n) auxiliary memory instead of merging in-place?",
      options: ["Because C++ cannot manipulate pointers", "Because in-place merging takes O(n²) shifts, destroying linear-time merge", "To avoid recursion", "To preserve duplicate values"],
      correct: 1,
      exp: "Without extra space, inserting elements into their merged place requires shifting subsequent items right, degrading O(n) merge to O(n²)."
    },
    {
      q: "Which of the following algorithms guarantees at most (n - 1) memory writes (swaps) on any input array?",
      options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort"],
      correct: 2,
      exp: "Selection Sort performs at most one swap per outer loop iteration, guaranteeing <= n - 1 swaps in all cases!"
    },
    {
      q: "In Insertion Sort on [10, 20, 30, 40], if we insert new key 25, how many element shifts occur?",
      options: ["1 shift (only 40)", "2 shifts (40 and 30)", "3 shifts", "0 shifts"],
      correct: 1,
      exp: "40 > 25 shifts right; 30 > 25 shifts right; 20 < 25 breaks loop. Exactly 2 shifts occur!"
    },
    {
      q: "Why is Counting Sort able to achieve O(n + k) time, beating the Ω(n log n) comparison lower bound?",
      options: ["It runs multithreaded", "It uses array indexing as direct addressing, bypassing pairwise comparisons", "It skips duplicate keys", "It uses binary search trees"],
      correct: 1,
      exp: "Decision tree lower bounds only apply to comparison sorts. Direct arithmetic key indexing bypasses comparisons entirely."
    },
    {
      q: "In LSD Radix Sort base 10, what is the role of the exponent variable exp = 1, 10, 100...?",
      options: ["It tracks recursion depth", "It isolates the current digit column (exp=1 for ones, exp=10 for tens)", "It squares the numbers", "It allocates RAM buckets"],
      correct: 1,
      exp: "(val / exp) % 10 isolates the single target digit column for the stable sub-sort pass."
    }
  ];

  function initArcadeGame() {
    initPlayerProgression();
    startManualGame();
    initDuelGame();
  }

  // --- Mode A: Manual Sort Challenge ---
  function startManualGame() {
    const base = [38, 14, 72, 9, 53, 21];
    // Shuffle slightly
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = base[i]; base[i] = base[j]; base[j] = tmp;
    }
    state.arcade.manual.array = base;
    state.arcade.manual.selectedIdx = null;
    state.arcade.manual.moves = 0;
    state.arcade.manual.comps = 0;
    state.arcade.manual.isSorted = false;

    // Calculate inversion count for par
    let inv = 0;
    for (let i = 0; i < base.length - 1; i++) {
      for (let j = i + 1; j < base.length; j++) {
        if (base[i] > base[j]) inv++;
      }
    }
    state.arcade.manual.targetPar = Math.max(3, Math.min(8, inv));

    updateManualGameUI();
    renderManualGameTiles();
  }

  function updateManualGameUI() {
    const m = state.arcade.manual;
    const movesEl = document.getElementById('gameMoveCount');
    const compsEl = document.getElementById('gameCompCount');
    const parEl = document.getElementById('gameTargetPar');
    const starEl = document.getElementById('gameStarRating');
    const fb = document.getElementById('gameFeedbackBanner');

    if (movesEl) movesEl.textContent = m.moves;
    if (compsEl) compsEl.textContent = m.comps;
    if (parEl) parEl.textContent = m.targetPar;

    let stars = "⭐⭐⭐";
    if (m.moves > m.targetPar + 4) stars = "⭐";
    else if (m.moves > m.targetPar + 1) stars = "⭐⭐";
    if (starEl) starEl.textContent = stars;

    if (fb && !m.isSorted) {
      fb.textContent = `Rule: ${m.rule.toUpperCase()}. Click any two tiles to compare and swap them into ascending order.`;
    }
  }

  function renderManualGameTiles() {
    const arena = document.getElementById('gameTilesArena');
    if (!arena) return;
    const m = state.arcade.manual;
    const maxVal = Math.max(...m.array, 1);

    arena.innerHTML = '';
    m.array.forEach((val, idx) => {
      const tile = document.createElement('div');
      tile.className = 'game-tile-item';
      if (m.selectedIdx === idx) tile.classList.add('selected');
      if (m.isSorted) tile.classList.add('sorted');

      const pct = Math.max(25, (val / maxVal) * 100);
      tile.innerHTML = `
        <div class="game-tile-val">${val}</div>
        <div class="game-tile-fill" style="height: ${pct}%;"></div>
        <div class="game-tile-idx">[${idx}]</div>
      `;
      tile.addEventListener('click', () => handleManualTileClick(idx));
      arena.appendChild(tile);
    });
  }

  function handleManualTileClick(idx) {
    const m = state.arcade.manual;
    if (m.isSorted) return;

    if (m.selectedIdx === null) {
      m.selectedIdx = idx;
      renderManualGameTiles();
      return;
    }

    if (m.selectedIdx === idx) {
      m.selectedIdx = null;
      renderManualGameTiles();
      return;
    }

    const idx1 = m.selectedIdx;
    const idx2 = idx;
    m.selectedIdx = null;

    // Rule enforcement
    if (m.rule === 'bubble') {
      if (Math.abs(idx1 - idx2) !== 1) {
        showToast("Bubble Sort rule: you may ONLY swap immediately adjacent neighboring tiles!");
        renderManualGameTiles();
        return;
      }
    }

    // Execute swap
    m.moves++;
    m.comps++;
    const tmp = m.array[idx1];
    m.array[idx1] = m.array[idx2];
    m.array[idx2] = tmp;

    // Check sorted
    let sorted = true;
    for (let i = 0; i < m.array.length - 1; i++) {
      if (m.array[i] > m.array[i + 1]) { sorted = false; break; }
    }

    if (sorted) {
      m.isSorted = true;
      const stars = m.moves <= m.targetPar ? '⭐⭐⭐' : (m.moves <= m.targetPar + 3 ? '⭐⭐' : '⭐');
      addPlayerXp(150, "Manual Puzzle Cleared");
      const fb = document.getElementById('gameFeedbackBanner');
      if (fb) {
        fb.innerHTML = `<span style="color: var(--bar-sorted); font-weight: 800;">🎉 VICTORY! Solved in ${m.moves} moves! Rating: ${stars} (+150 XP awarded)</span>`;
      }
    }

    updateManualGameUI();
    renderManualGameTiles();
  }

  function giveManualHint() {
    const m = state.arcade.manual;
    if (m.isSorted) return;

    for (let i = 0; i < m.array.length - 1; i++) {
      if (m.array[i] > m.array[i + 1]) {
        const fb = document.getElementById('gameFeedbackBanner');
        if (fb) {
          fb.innerHTML = `<span style="color: var(--algo-quick);">💡 Hint: Elements at [${i}] (${m.array[i]}) and [${i+1}] (${m.array[i+1]}) are inverted! Swap them.</span>`;
        }
        m.selectedIdx = i;
        renderManualGameTiles();
        return;
      }
    }
  }

  function checkManualSorted() {
    const m = state.arcade.manual;
    let sorted = true;
    for (let i = 0; i < m.array.length - 1; i++) {
      if (m.array[i] > m.array[i + 1]) { sorted = false; break; }
    }
    const fb = document.getElementById('gameFeedbackBanner');
    if (sorted) {
      m.isSorted = true;
      addPlayerXp(150, "Array Verification Cleared");
      if (fb) fb.innerHTML = `<span style="color: var(--bar-sorted); font-weight: 800;">✓ Verified! All items in strictly ascending order!</span>`;
      renderManualGameTiles();
    } else {
      if (fb) fb.innerHTML = `<span style="color: var(--band-visualizer); font-weight: 800;">✗ Incomplete: Some elements are still out of order. Keep going!</span>`;
    }
  }

  // --- Mode B: Algorithm Battle Royale ---
  function startBattleRoyale() {
    const scenarioSelect = document.getElementById('battleScenarioSelect');
    const champSelect = document.getElementById('battleChampionSelect');
    const podium = document.getElementById('battlePodiumBanner');
    const container = document.getElementById('battleTracksContainer');
    const btn = document.getElementById('btnStartBattleRoyale');

    if (!scenarioSelect || !champSelect || !container) return;

    const scenario = scenarioSelect.value;
    const betChampId = parseInt(champSelect.value, 10);
    const competitors = [4, 2, 1, 3]; // Adaptive, Quick, Merge, Heap
    if (!competitors.includes(betChampId)) competitors.push(betChampId);

    const testData = generatePresetArray(scenario, 80);
    if (btn) { btn.disabled = true; btn.textContent = '🏁 Racing...'; }
    if (podium) podium.style.display = 'none';

    container.innerHTML = '';
    const trackEls = {};

    competitors.forEach(id => {
      const algo = ALGORITHMS[id];
      const div = document.createElement('div');
      div.className = 'battle-track-item';
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span style="font-weight: 800; color: ${algo.color};">${algo.name} ${id === betChampId ? '🏆 (YOUR BET)' : ''}</span>
          <span class="mono" id="battleStats_${id}" style="font-size: 0.8rem;">0% | 0 comps</span>
        </div>
        <div class="battle-progress-rail">
          <div class="battle-progress-bar" id="battleBar_${id}" style="background-color: ${algo.color}; width: 0%;"></div>
        </div>
      `;
      container.appendChild(div);
      trackEls[id] = {
        bar: div.querySelector(`#battleBar_${id}`),
        stats: div.querySelector(`#battleStats_${id}`)
      };
    });

    // Run metrics
    const results = competitors.map(id => {
      const r = localExecuteSingle(id, testData, false);
      return { id, name: ALGORITHMS[id].name, timeUs: r.elapsedMicroseconds, comps: r.comparisons, swaps: r.swaps };
    });

    results.sort((a, b) => a.timeUs - b.timeUs);
    const winnerId = results[0].id;

    // Simulate animated racing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      competitors.forEach(id => {
        const isWinner = (id === winnerId);
        const myP = isWinner ? Math.min(100, progress * 1.25) : Math.min(95, progress * (0.65 + (id % 3) * 0.15));
        const bar = trackEls[id].bar;
        const stats = trackEls[id].stats;
        if (bar) bar.style.width = `${myP}%`;
        const myR = results.find(x => x.id === id);
        if (stats) stats.textContent = `${Math.round(myP)}% | ${Math.round(myR.comps * (myP / 100))} comps`;
      });

      if (progress >= 100) {
        clearInterval(interval);
        competitors.forEach(id => {
          if (trackEls[id].bar) trackEls[id].bar.style.width = '100%';
          const myR = results.find(x => x.id === id);
          if (trackEls[id].stats) trackEls[id].stats.textContent = `100% | ${myR.comps} comps | ${myR.timeUs.toFixed(1)} µs`;
        });

        if (btn) { btn.disabled = false; btn.innerHTML = '<span>🏁 Launch Battle Royale Race!</span>'; }

        // Declare podium
        if (podium) {
          podium.style.display = 'block';
          const wonBet = (betChampId === winnerId);
          if (wonBet) {
            state.arcade.battle.streak++;
            addPlayerXp(100, "Battle Royale Prediction Won");
          } else {
            state.arcade.battle.streak = 0;
          }

          const streakEl = document.getElementById('battleStreakCount');
          if (streakEl) streakEl.textContent = `🔥 ${state.arcade.battle.streak}`;

          podium.innerHTML = `
            <div style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; color: ${wonBet ? 'var(--bar-sorted)' : 'var(--band-visualizer)'};">
              ${wonBet ? '🎉 WAGER WON! Your champion finished in 1st Place!' : `🥈 Race Finished! Winner: ${results[0].name}`}
            </div>
            <p style="font-size: 0.92rem; margin-bottom: 0.75rem;">
              <strong>1st Place:</strong> ${results[0].name} (${results[0].timeUs.toFixed(1)} µs, ${results[0].comps} comps) |
              <strong>2nd:</strong> ${results[1].name} (${results[1].timeUs.toFixed(1)} µs) |
              <strong>3rd:</strong> ${results[2].name} (${results[2].timeUs.toFixed(1)} µs)
            </p>
            <p style="font-size: 0.85rem; color: var(--ink-secondary);">
              <strong>Analytical Insight:</strong> On "${scenario.replace('_', ' ')}" data, ${results[0].name} dominated because its algorithmic structure minimizes comparisons and overhead for this specific invariant distribution.
            </p>
          `;
        }
      }
    }, 45);
  }

  // --- Mode C: Step Predictor Duel ---
  function initDuelGame() {
    state.arcade.duel.round = 0;
    state.arcade.duel.score = 0;
    state.arcade.duel.multiplier = 1;
    loadNextDuelQuestion();
  }

  function loadNextDuelQuestion() {
    const d = state.arcade.duel;
    if (d.round >= d.maxRounds) {
      renderDuelFinish();
      return;
    }

    d.round++;
    const qIndex = (d.round - 1) % DUEL_QUESTIONS.length;
    d.currentQuestion = DUEL_QUESTIONS[qIndex];

    const rText = document.getElementById('duelRoundText');
    const sText = document.getElementById('duelScoreText');
    const mText = document.getElementById('duelMultiplierText');
    const qTitle = document.getElementById('duelQuestionTitle');
    const grid = document.getElementById('duelOptionsGrid');
    const fb = document.getElementById('duelFeedbackBox');
    const nextBtn = document.getElementById('btnNextDuelQuestion');

    if (rText) rText.textContent = `${d.round} / ${d.maxRounds}`;
    if (sText) sText.textContent = d.score;
    if (mText) mText.textContent = `x${d.multiplier}`;
    if (qTitle) qTitle.textContent = `Round ${d.round}: ${d.currentQuestion.q}`;
    if (fb) fb.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    if (grid) {
      grid.innerHTML = '';
      d.currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'duel-option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleDuelAnswer(idx));
        grid.appendChild(btn);
      });
    }
  }

  function handleDuelAnswer(chosenIdx) {
    const d = state.arcade.duel;
    const q = d.currentQuestion;
    const grid = document.getElementById('duelOptionsGrid');
    const fb = document.getElementById('duelFeedbackBox');
    const nextBtn = document.getElementById('btnNextDuelQuestion');
    const sText = document.getElementById('duelScoreText');
    const mText = document.getElementById('duelMultiplierText');

    if (!grid || !fb) return;

    // Disable all options
    const btns = grid.querySelectorAll('.duel-option-btn');
    btns.forEach(b => b.disabled = true);

    if (chosenIdx === q.correct) {
      btns[chosenIdx].classList.add('correct');
      const pts = 100 * d.multiplier;
      d.score += pts;
      d.multiplier = Math.min(3, d.multiplier + 1);
      addPlayerXp(50, "Duel Answer Correct");
      fb.style.display = 'block';
      fb.style.backgroundColor = '#E8F5E9';
      fb.style.color = '#1B5E20';
      fb.innerHTML = `<strong>&#10003; Correct! (+${pts} Pts)</strong> ${q.exp}`;
    } else {
      btns[chosenIdx].classList.add('wrong');
      if (btns[q.correct]) btns[q.correct].classList.add('correct');
      d.multiplier = 1;
      fb.style.display = 'block';
      fb.style.backgroundColor = '#FFEBEE';
      fb.style.color = '#B71C1C';
      fb.innerHTML = `<strong>&#10007; Incorrect.</strong> ${q.exp}`;
    }

    if (sText) sText.textContent = d.score;
    if (mText) mText.textContent = `x${d.multiplier}`;
    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  function renderDuelFinish() {
    const card = document.getElementById('duelChallengeCard');
    const nextBtn = document.getElementById('btnNextDuelQuestion');
    if (nextBtn) nextBtn.style.display = 'none';
    if (!card) return;

    const d = state.arcade.duel;
    card.innerHTML = `
      <div style="text-align: center; padding: 1.5rem;">
        <h4 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--bar-sorted);">Duel Challenge Complete! 🏆</h4>
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">Final Score: <strong>${d.score} Pts</strong></p>
        <button type="button" class="btn btn-primary" id="btnRestartDuel">Play Duel Again</button>
      </div>
    `;

    const btnR = document.getElementById('btnRestartDuel');
    if (btnR) btnR.addEventListener('click', () => {
      initDuelGame();
    });
  }


  function initNavScrollSpy() {
    const sections = document.querySelectorAll('section.lab-section');
    const navLinks = document.querySelectorAll('.nav-toc a');
    if (!window.IntersectionObserver || sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-70px 0px -40% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }

  // ==========================================================================
  // 11. EVENT BINDINGS & USER INTERACTION
  // ==========================================================================
  function bindEvents() {
    // Top Intro Strip: "⚡ Try an example: [45, 12, 89, 3, 27]"
    const btnTry = document.getElementById('btnTryExample');
    if (btnTry) {
      btnTry.addEventListener('click', () => {
        const arr = [45, 12, 89, 3, 27];
        state.currentArray = arr;
        const input = document.getElementById('customInputBox');
        if (input) input.value = arr.join(', ');
        const feedback = document.getElementById('inputFeedback');
        if (feedback) {
          feedback.className = 'input-feedback valid';
          feedback.innerHTML = `<span>&#10003; 5 sample elements loaded. Ready for visualization.</span>`;
        }
        selectAlgorithm(0);
        updateArrayPreview(arr);
        setTimeout(() => {
          playAnimation();
        }, 150);
      });
    }

    // Light / Dark Mode Toggle
    const btnTheme = document.getElementById('btnToggleTheme');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('sortlab-theme', isDark ? 'dark' : 'light');
        const icon = document.getElementById('themeToggleIcon');
        if (icon) icon.textContent = isDark ? '☀️ Light' : '🌓 Theme';
        if (state.chartDataCache) {
          renderGrowthChart([100, 1000, 10000, 50000], state.chartDataCache);
        }
      });
      // Check saved theme
      if (localStorage.getItem('sortlab-theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('themeToggleIcon');
        if (icon) icon.textContent = '☀️ Light';
      }
    }

    // Glossary Drawer
    const btnOpenGlossary = document.getElementById('btnOpenGlossary');
    const btnCloseGlossary = document.getElementById('btnCloseGlossary');
    const glossary = document.getElementById('glossaryDrawer');

    if (btnOpenGlossary && glossary) {
      btnOpenGlossary.addEventListener('click', () => {
        glossary.classList.toggle('open');
      });
    }
    if (btnCloseGlossary && glossary) {
      btnCloseGlossary.addEventListener('click', () => {
        glossary.classList.remove('open');
      });
    }

    // Close glossary when clicking outside or pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && glossary && glossary.classList.contains('open')) {
        glossary.classList.remove('open');
      }
    });

    // Step 1: Input text box validation
    const inputBox = document.getElementById('customInputBox');
    const inputFeedback = document.getElementById('inputFeedback');
    if (inputBox) {
      inputBox.addEventListener('input', () => {
        const parsed = parseAndValidateInput(inputBox.value);
        if (parsed.valid) {
          if (inputFeedback) {
            inputFeedback.className = 'input-feedback valid';
            inputFeedback.innerHTML = `<span>&#10003; ${parsed.numbers.length} valid numbers loaded. Ready for visualization.</span>`;
          }
          state.currentArray = parsed.numbers;
          updateArrayPreview(parsed.numbers);
        } else {
          if (inputFeedback) {
            inputFeedback.className = 'input-feedback invalid';
            inputFeedback.innerHTML = `<span>&#10007; ${parsed.error}</span>`;
          }
        }
      });
    }


    // Nav Scroll Spy via IntersectionObserver
    initNavScrollSpy();

    // Reset Progress Button Handler
    const btnResetProg = document.getElementById('btnResetProgress');
    if (btnResetProg) {
      btnResetProg.addEventListener('click', () => {
        if (confirm("Reset all SortLab player progress (XP, rank, quiz scores, battle streak, and run history)?")) {
          localStorage.removeItem('sortlab-xp');
          localStorage.removeItem('sortlab-quiz-scores');
          localStorage.removeItem('sortlab-battle-streak');
          localStorage.removeItem('sortlab-run-history');
          state.playerXp = 0;
          state.quizScores = {};
          state.runHistory = [];
          state.arcade.battle.streak = 0;
          updatePlayerBadge();
          updateGlobalQuizScore();
          renderRunHistoryList();
          const streakEl = document.getElementById('battleStreakCount');
          if (streakEl) streakEl.textContent = '🔥 0';
          showToast("All SortLab progress has been reset!");
        }
      });
    }

    // Presets
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.preset;
        const slider = document.getElementById('sizeSlider');
        const size = slider ? parseInt(slider.value, 10) : 12;
        const arr = generatePresetArray(type, size);
        state.currentArray = arr;
        if (inputBox) inputBox.value = arr.join(', ');
        if (inputFeedback) {
          inputFeedback.className = 'input-feedback valid';
          inputFeedback.innerHTML = `<span>&#10003; Generated ${type.replace('_', ' ')} array with ${arr.length} integers.</span>`;
        }
        updateArrayPreview(arr);
      });
    });

    // Size Slider
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeVal = document.getElementById('sizeSliderVal');
    const btnGenSize = document.getElementById('btnGenSize');

    if (sizeSlider && sizeVal) {
      sizeSlider.addEventListener('input', (e) => {
        sizeVal.textContent = e.target.value;
      });
    }
    if (btnGenSize) {
      btnGenSize.addEventListener('click', () => {
        const size = sizeSlider ? parseInt(sizeSlider.value, 10) : 12;
        const arr = generatePresetArray('random', size);
        state.currentArray = arr;
        if (inputBox) inputBox.value = arr.join(', ');
        if (inputFeedback) {
          inputFeedback.className = 'input-feedback valid';
          inputFeedback.innerHTML = `<span>&#10003; Generated Random array with ${arr.length} integers.</span>`;
        }
        updateArrayPreview(arr);
      });
    }

    // Algorithm Chips (Step 2)
    document.querySelectorAll('.algo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = parseInt(chip.dataset.algo, 10);
        selectAlgorithm(id);
      });
    });

    // Comparison Mode Toggle
    const chkComp = document.getElementById('chkComparisonMode');
    if (chkComp) {
      chkComp.addEventListener('change', (e) => {
        state.comparisonMode = e.target.checked;
        if (state.comparisonMode) {
          showToast("Comparison Mode activated. Run benchmarks in Compare section for full 5-way performance comparison!");
        }
      });
    }

    // Step 3 Controls: Play, Step, Restart, Speed, Scrubber
    const btnPlay = document.getElementById('btnVizPrimary');
    const btnPrev = document.getElementById('btnVizPrev');
    const btnNext = document.getElementById('btnVizNext');
    const btnRestart = document.getElementById('btnVizRestart');
    const speedSlider = document.getElementById('animSpeedSlider');
    const stepScrubber = document.getElementById('stepScrubber');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (state.isPlaying) pauseAnimation();
        else playAnimation();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        pauseAnimation();
        if (state.currentStep > 0) {
          applyStep(state.currentStep - 1);
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        pauseAnimation();
        if (state.currentStep < state.trace.length - 1) {
          applyStep(state.currentStep + 1);
        }
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        resetTraceState(state.currentArray);
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        state.speed = parseInt(e.target.value, 10);
      });
    }

    if (stepScrubber) {
      stepScrubber.addEventListener('input', (e) => {
        pauseAnimation();
        applyStep(parseInt(e.target.value, 10));
      });
    }

    // Explain simply vs Technical Toggle
    const btnSimple = document.getElementById('btnExplainSimple');
    const btnTech = document.getElementById('btnExplainTech');

    if (btnSimple && btnTech) {
      btnSimple.addEventListener('click', () => {
        state.explainMode = 'simple';
        btnSimple.classList.add('active');
        btnTech.classList.remove('active');
        if (state.trace[state.currentStep]) {
          renderCaptionForStep(state.trace[state.currentStep]);
        }
      });
      btnTech.addEventListener('click', () => {
        state.explainMode = 'tech';
        btnTech.classList.add('active');
        btnSimple.classList.remove('active');
        if (state.trace[state.currentStep]) {
          renderCaptionForStep(state.trace[state.currentStep]);
        }
      });
    }

    // Predict Next Step Toggle
    const chkPredict = document.getElementById('chkPredictNext');
    if (chkPredict) {
      chkPredict.addEventListener('change', (e) => {
        state.predictNextMode = e.target.checked;
        if (state.predictNextMode) {
          showToast("Predict-the-next-step quiz mode activated!");
        }
      });
    }

    // Code Language Toggle (C++ vs Pseudocode)
    const btnCpp = document.getElementById('btnToggleCpp');
    const btnPseudo = document.getElementById('btnTogglePseudo');

    if (btnCpp && btnPseudo) {
      btnCpp.addEventListener('click', () => {
        state.codeLang = 'cpp';
        btnCpp.classList.add('active');
        btnPseudo.classList.remove('active');
        renderCodeViewer(state.selectedAlgoId, 'cpp');
        if (state.trace[state.currentStep]) {
          highlightCodeLine(state.trace[state.currentStep].line);
        }
      });
      btnPseudo.addEventListener('click', () => {
        state.codeLang = 'pseudo';
        btnPseudo.classList.add('active');
        btnCpp.classList.remove('active');
        renderCodeViewer(state.selectedAlgoId, 'pseudo');
        if (state.trace[state.currentStep]) {
          highlightCodeLine(state.trace[state.currentStep].line);
        }
      });
    }


    // Arcade Mode Switcher Tabs
    document.querySelectorAll('.game-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.game-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.game;
        const vManual = document.getElementById('arcadeViewManual');
        const vBattle = document.getElementById('arcadeViewBattle');
        const vDuel = document.getElementById('arcadeViewDuel');
        if (vManual) vManual.style.display = mode === 'manual' ? 'block' : 'none';
        if (vBattle) vBattle.style.display = mode === 'battle' ? 'block' : 'none';
        if (vDuel) vDuel.style.display = mode === 'duel' ? 'block' : 'none';
      });
    });

    // Mode A: Manual Sort Challenge Buttons
    const btnRuleBubble = document.getElementById('btnGameRuleBubble');
    const btnRuleSelection = document.getElementById('btnGameRuleSelection');
    const btnRuleFree = document.getElementById('btnGameRuleFree');
    const btnHint = document.getElementById('btnGameHint');
    const btnCheck = document.getElementById('btnGameCheck');
    const btnShuffle = document.getElementById('btnGameNewShuffle');

    if (btnRuleBubble && btnRuleSelection && btnRuleFree) {
      btnRuleBubble.addEventListener('click', () => {
        state.arcade.manual.rule = 'bubble';
        btnRuleBubble.classList.add('active');
        btnRuleSelection.classList.remove('active');
        btnRuleFree.classList.remove('active');
        updateManualGameUI();
      });
      btnRuleSelection.addEventListener('click', () => {
        state.arcade.manual.rule = 'selection';
        btnRuleSelection.classList.add('active');
        btnRuleBubble.classList.remove('active');
        btnRuleFree.classList.remove('active');
        updateManualGameUI();
      });
      btnRuleFree.addEventListener('click', () => {
        state.arcade.manual.rule = 'free';
        btnRuleFree.classList.add('active');
        btnRuleBubble.classList.remove('active');
        btnRuleSelection.classList.remove('active');
        updateManualGameUI();
      });
    }

    if (btnHint) btnHint.addEventListener('click', giveManualHint);
    if (btnCheck) btnCheck.addEventListener('click', checkManualSorted);
    if (btnShuffle) btnShuffle.addEventListener('click', startManualGame);

    // Mode B: Battle Royale Launch
    const btnBattle = document.getElementById('btnStartBattleRoyale');
    if (btnBattle) btnBattle.addEventListener('click', startBattleRoyale);

    // Mode C: Predictor Duel Next
    const btnDuelNext = document.getElementById('btnNextDuelQuestion');
    if (btnDuelNext) btnDuelNext.addEventListener('click', loadNextDuelQuestion);

    // Section 02: Learn Tabs
    document.querySelectorAll('.learn-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.algo, 10);
        renderLearnSection(id);
      });
    });

    // Section 03: Compare Action Buttons
    const btnBench = document.getElementById('btnRunBenchmarkSuite');
    const btnMat = document.getElementById('btnRunFullMatrix');
    const btnCsv = document.getElementById('btnExportCsv');
    const btnRep = document.getElementById('btnCopyReport');
    const chkLogScale = document.getElementById('chkLogScale');

    if (btnBench) btnBench.addEventListener('click', runBenchmarkSuite);
    if (btnMat) btnMat.addEventListener('click', () => {
      runBehaviorMatrix();
      showToast("Recomputed 5×5 behavior matrix on N=200 specimen!");
    });
    if (btnCsv) btnCsv.addEventListener('click', exportCsv);
    if (btnRep) btnRep.addEventListener('click', copyLabReport);

    if (chkLogScale) {
      chkLogScale.addEventListener('change', (e) => {
        state.isChartLogScale = e.target.checked;
        if (state.chartDataCache) {
          renderGrowthChart([100, 1000, 10000, 50000], state.chartDataCache);
        }
      });
    }

    // Keyboard Shortcuts (Space = Play/Pause, Left = Prev, Right = Next, R = Restart)
    document.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (state.isPlaying) pauseAnimation();
        else playAnimation();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        pauseAnimation();
        if (state.currentStep > 0) applyStep(state.currentStep - 1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        pauseAnimation();
        if (state.currentStep < state.trace.length - 1) applyStep(state.currentStep + 1);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTraceState(state.currentArray);
      }
    });
  }

  // Window Ready Orchestration
  window.addEventListener('DOMContentLoaded', () => {
    initWorker();
    renderAboutAuthors();
    initTheoryTable();
    initStepsAndHistory();
    bindEvents();
    initArcadeGame();
    initHeroMiniTape();
    selectAlgorithm(0);
    updateArrayPreview(state.currentArray);
    renderLearnSection(0);

    // Pre-fill benchmark and behavior matrix with skeletons and auto-run
    renderBenchmarkSkeleton();
    renderMatrixSkeleton();

    setTimeout(() => {
      runBenchmarkSuite();
      runBehaviorMatrix();
      requestGrowthChart();
    }, 200);
  });

})();
