import { PrismaClient, QuestionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AcademILMS with full course content...\n");

  // ============ USERS ============
  const adminPw = await bcrypt.hash("admin123", 12);
  const instrPw = await bcrypt.hash("instructor123", 12);
  const stuPw = await bcrypt.hash("student123", 12);

  const admin = await prisma.user.upsert({ where: { email: "admin@learnforge.dev" }, update: {}, create: { name: "Admin User", email: "admin@learnforge.dev", password: adminPw, role: "ADMIN", isApproved: true } });

  const instructors = await Promise.all([
    prisma.user.upsert({ where: { email: "instructor@learnforge.dev" }, update: {}, create: { name: "Sarah Johnson", email: "instructor@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "Full-stack developer with 8 years of experience. Previously at Google and Meta. Passionate about teaching web development and system design." } }),
    prisma.user.upsert({ where: { email: "dr.ahmed@learnforge.dev" }, update: {}, create: { name: "Dr. Ahmed Khan", email: "dr.ahmed@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "PhD in Computer Science from LUMS. 12 years of teaching experience in algorithms, data structures, and theory of computation. Published 30+ research papers." } }),
    prisma.user.upsert({ where: { email: "prof.maria@learnforge.dev" }, update: {}, create: { name: "Prof. Maria Chen", email: "prof.maria@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "AI/ML researcher and professor. PhD from Stanford. Specializes in deep learning, computer vision, and natural language processing." } }),
    prisma.user.upsert({ where: { email: "ali.raza@learnforge.dev" }, update: {}, create: { name: "Ali Raza", email: "ali.raza@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "Senior DevOps engineer at AWS. Expert in cloud computing, Docker, Kubernetes, and CI/CD pipelines. AWS Solutions Architect certified." } }),
    prisma.user.upsert({ where: { email: "emma.wilson@learnforge.dev" }, update: {}, create: { name: "Emma Wilson", email: "emma.wilson@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "Cybersecurity consultant and ethical hacker. CISSP and CEH certified. 10 years of experience in penetration testing and security audits." } }),
  ]);

  const students = await Promise.all([
    prisma.user.upsert({ where: { email: "student@learnforge.dev" }, update: {}, create: { name: "Alex Chen", email: "student@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "fatima.zahra@learnforge.dev" }, update: {}, create: { name: "Fatima Zahra", email: "fatima.zahra@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "james.smith@learnforge.dev" }, update: {}, create: { name: "James Smith", email: "james.smith@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "aisha.malik@learnforge.dev" }, update: {}, create: { name: "Aisha Malik", email: "aisha.malik@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "omar.hassan@learnforge.dev" }, update: {}, create: { name: "Omar Hassan", email: "omar.hassan@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "lisa.park@learnforge.dev" }, update: {}, create: { name: "Lisa Park", email: "lisa.park@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "hassan.ali@learnforge.dev" }, update: {}, create: { name: "Hassan Ali", email: "hassan.ali@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
    prisma.user.upsert({ where: { email: "sofia.garcia@learnforge.dev" }, update: {}, create: { name: "Sofia Garcia", email: "sofia.garcia@learnforge.dev", password: stuPw, role: "STUDENT", isApproved: true } }),
  ]);

  console.log(`  Created ${instructors.length} instructors, ${students.length} students`);

  // ============ CATEGORIES ============
  const catData = [
    { name: "Programming Fundamentals", slug: "programming-fundamentals" },
    { name: "Data Structures & Algorithms", slug: "data-structures-algorithms" },
    { name: "Web Development", slug: "web-development" },
    { name: "Database Systems", slug: "database-systems" },
    { name: "Artificial Intelligence", slug: "artificial-intelligence" },
    { name: "Cybersecurity", slug: "cybersecurity" },
    { name: "Cloud Computing & DevOps", slug: "cloud-computing-devops" },
    { name: "Software Engineering", slug: "software-engineering" },
    { name: "Computer Networks", slug: "computer-networks" },
    { name: "Operating Systems", slug: "operating-systems" },
  ];

  for (const c of catData) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  console.log(`  Created ${cats.length} categories`);

  // ============ COURSES WITH FULL CONTENT ============

  const coursesData = [
    {
      title: "CS1002: Programming Fundamentals with C++",
      slug: "programming-fundamentals-cpp",
      description: "A comprehensive introduction to programming using C++. This course covers variables, control structures, functions, arrays, pointers, and object-oriented programming basics. Designed for absolute beginners with no prior coding experience. By the end of this course, you will be able to write complete C++ programs, understand memory management, and solve real-world problems using algorithms.",
      categorySlug: "programming-fundamentals",
      instructorIdx: 0,
      price: 0,
      isFree: true,
      level: "Beginner",
      modules: [
        {
          title: "Getting Started with C++",
          lessons: [
            { title: "What is Programming?", content: "Programming is the process of writing instructions that a computer can execute. These instructions, called code, are written in programming languages like C++, Python, Java, and many others.\n\nA program is simply a set of step-by-step instructions that tells the computer what to do. Think of it like a recipe: you give the computer ingredients (data) and a set of steps (algorithms) to produce a result (output).\n\nC++ was developed by Bjarne Stroustrup in 1979 at Bell Labs. It is an extension of the C programming language with added features like classes and objects. Today, C++ is used in game development, operating systems, browsers, embedded systems, and high-performance applications.\n\nIn this course, we will start from the very basics and gradually build up to writing complex programs." },
            { title: "Setting Up Your Development Environment", content: "Before you can write C++ programs, you need a development environment. Here is what you need:\n\n1. A text editor or IDE (Integrated Development Environment)\n   - Visual Studio Code (free, lightweight, cross-platform)\n   - Code::Blocks (free, designed for C/C++)\n   - CLion (paid, professional-grade)\n\n2. A C++ compiler\n   - GCC (GNU Compiler Collection) - comes with MinGW on Windows\n   - MSVC (Microsoft Visual C++) - comes with Visual Studio\n   - Clang - popular on macOS\n\nInstallation steps for Windows:\n1. Download MinGW from mingw-w64.org\n2. Add the bin folder to your system PATH\n3. Open Command Prompt and type: g++ --version\n4. If you see version info, the compiler is ready\n\nInstallation steps for VS Code:\n1. Install the C/C++ extension by Microsoft\n2. Create a new file with .cpp extension\n3. Write your code and use the terminal to compile" },
            { title: "Your First C++ Program: Hello World", content: "Every programming journey starts with Hello World. Here is the classic first program:\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}\n\nLet us break this down line by line:\n\n#include <iostream> - This is a preprocessor directive. It tells the compiler to include the iostream library, which provides input/output functionality.\n\nusing namespace std; - This line allows us to use cout and cin without writing std:: before them.\n\nint main() - This is the main function. Every C++ program must have a main function. The program starts executing from here. int means it returns an integer.\n\ncout << \"Hello, World!\" - cout (character output) displays text on the screen. The << operator sends data to cout.\n\nendl - This moves the cursor to the next line (like pressing Enter).\n\nreturn 0; - This tells the operating system that the program finished successfully. 0 means no errors." },
            { title: "Variables and Data Types", content: "Variables are containers that store data in memory. Every variable has a name, a type, and a value.\n\nBasic data types in C++:\n\nint - Stores whole numbers (4 bytes)\n  Example: int age = 21;\n\nfloat - Stores decimal numbers (4 bytes, ~7 digits precision)\n  Example: float gpa = 3.85;\n\ndouble - Stores decimal numbers (8 bytes, ~15 digits precision)\n  Example: double pi = 3.14159265358979;\n\nchar - Stores a single character (1 byte)\n  Example: char grade = 'A';\n\nbool - Stores true or false (1 byte)\n  Example: bool isPassed = true;\n\nstring - Stores text (variable size, needs #include <string>)\n  Example: string name = \"Muhammad Hamza\";\n\nVariable naming rules:\n- Must start with a letter or underscore\n- Can contain letters, digits, and underscores\n- Cannot use reserved keywords (int, float, return, etc.)\n- Case-sensitive (age and Age are different variables)\n- Use meaningful names (studentAge is better than x)" },
            { title: "Input and Output Operations", content: "C++ uses cin for input and cout for output. Both are part of the iostream library.\n\nOutput with cout:\ncout << \"Your age is: \" << age << endl;\n\nYou can chain multiple items with <<:\ncout << \"Name: \" << name << \", Age: \" << age << endl;\n\nInput with cin:\nint age;\ncout << \"Enter your age: \";\ncin >> age;\n\nReading strings with spaces:\nstring fullName;\ncout << \"Enter your full name: \";\ngetline(cin, fullName);\n\nNote: cin >> stops at whitespace, so for full names with spaces, use getline().\n\nFormatting output:\n#include <iomanip>\ncout << fixed << setprecision(2) << 3.14159; // Output: 3.14\ncout << setw(10) << \"Hello\"; // Right-aligned in 10 chars" },
          ],
          quiz: {
            title: "Getting Started Quiz",
            passMark: 60,
            questions: [
              { text: "Who developed C++?", type: "MCQ", options: [{ text: "Dennis Ritchie", isCorrect: false }, { text: "Bjarne Stroustrup", isCorrect: true }, { text: "James Gosling", isCorrect: false }, { text: "Guido van Rossum", isCorrect: false }] },
              { text: "Every C++ program must have a main() function", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
              { text: "Which data type stores decimal numbers with higher precision?", type: "MCQ", options: [{ text: "int", isCorrect: false }, { text: "float", isCorrect: false }, { text: "double", isCorrect: true }, { text: "char", isCorrect: false }] },
            ],
          },
        },
        {
          title: "Control Structures",
          lessons: [
            { title: "If-Else Statements", content: "Control structures allow your program to make decisions. The if-else statement executes different blocks of code based on a condition.\n\nBasic if statement:\nif (age >= 18) {\n    cout << \"You are an adult.\" << endl;\n}\n\nIf-else:\nif (score >= 50) {\n    cout << \"You passed!\" << endl;\n} else {\n    cout << \"You failed.\" << endl;\n}\n\nIf-else if-else (multiple conditions):\nif (grade >= 90) {\n    cout << \"A grade\" << endl;\n} else if (grade >= 80) {\n    cout << \"B grade\" << endl;\n} else if (grade >= 70) {\n    cout << \"C grade\" << endl;\n} else {\n    cout << \"Below C\" << endl;\n}\n\nComparison operators:\n== (equal to), != (not equal), > (greater than)\n< (less than), >= (greater or equal), <= (less or equal)\n\nLogical operators:\n&& (AND) - both conditions must be true\n|| (OR) - at least one condition must be true\n! (NOT) - reverses the condition" },
            { title: "Switch Statements", content: "The switch statement is useful when you have multiple possible values for a single variable.\n\nint day = 3;\nswitch (day) {\n    case 1: cout << \"Monday\"; break;\n    case 2: cout << \"Tuesday\"; break;\n    case 3: cout << \"Wednesday\"; break;\n    case 4: cout << \"Thursday\"; break;\n    case 5: cout << \"Friday\"; break;\n    case 6: cout << \"Saturday\"; break;\n    case 7: cout << \"Sunday\"; break;\n    default: cout << \"Invalid day\";\n}\n\nImportant rules:\n- Each case must end with break; otherwise execution falls through to the next case\n- The default case handles values not matched by any case\n- Switch works with int, char, and enum types (not strings in standard C++)\n- You can group cases:\n  case 6:\n  case 7:\n      cout << \"Weekend\";\n      break;" },
            { title: "For Loops", content: "Loops allow you to repeat a block of code multiple times.\n\nThe for loop has three parts: initialization, condition, and update.\n\nfor (int i = 0; i < 10; i++) {\n    cout << i << \" \";\n}\n// Output: 0 1 2 3 4 5 6 7 8 9\n\nCounting backwards:\nfor (int i = 10; i > 0; i--) {\n    cout << i << \" \";\n}\n// Output: 10 9 8 7 6 5 4 3 2 1\n\nNested loops (multiplication table):\nfor (int i = 1; i <= 5; i++) {\n    for (int j = 1; j <= 5; j++) {\n        cout << i * j << \"\\t\";\n    }\n    cout << endl;\n}\n\nRange-based for loop (C++11):\nint arr[] = {10, 20, 30, 40, 50};\nfor (int x : arr) {\n    cout << x << \" \";\n}" },
            { title: "While and Do-While Loops", content: "The while loop repeats as long as a condition is true.\n\nint count = 0;\nwhile (count < 5) {\n    cout << count << \" \";\n    count++;\n}\n// Output: 0 1 2 3 4\n\nThe do-while loop executes at least once before checking the condition.\n\nint num;\ndo {\n    cout << \"Enter a positive number: \";\n    cin >> num;\n} while (num <= 0);\n// Keeps asking until user enters a positive number\n\nKey difference:\n- while: checks condition BEFORE executing the body\n- do-while: executes the body FIRST, then checks condition\n\nInfinite loop (use with caution):\nwhile (true) {\n    // runs forever unless you use break\n    if (someCondition) break;\n}\n\nBreak and Continue:\n- break: exits the loop immediately\n- continue: skips the rest of the current iteration and moves to the next" },
          ],
        },
        {
          title: "Functions",
          lessons: [
            { title: "Defining and Calling Functions", content: "A function is a reusable block of code that performs a specific task.\n\nFunction syntax:\nreturnType functionName(parameters) {\n    // function body\n    return value;\n}\n\nExample:\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = add(5, 3);\n    cout << \"Sum: \" << result << endl; // Output: Sum: 8\n    return 0;\n}\n\nVoid functions (no return value):\nvoid greet(string name) {\n    cout << \"Hello, \" << name << \"!\" << endl;\n}\n\nFunction declaration (prototype):\nint multiply(int a, int b); // declaration\n\nint main() {\n    cout << multiply(4, 5); // works because of declaration above\n}\n\nint multiply(int a, int b) { // definition\n    return a * b;\n}" },
            { title: "Pass by Value vs Pass by Reference", content: "When you pass arguments to functions, you can pass them by value or by reference.\n\nPass by value (default):\nvoid increment(int x) {\n    x++; // modifies the local copy only\n}\nint a = 5;\nincrement(a);\ncout << a; // still 5, original not changed\n\nPass by reference (using &):\nvoid increment(int &x) {\n    x++; // modifies the original variable\n}\nint a = 5;\nincrement(a);\ncout << a; // now 6, original was changed\n\nWhen to use which:\n- Pass by value: when you do not want the function to modify the original\n- Pass by reference: when you want the function to modify the original, or for large objects (avoids copying)\n\nConst reference (read-only):\nvoid display(const string &name) {\n    cout << name; // can read but cannot modify\n}" },
            { title: "Recursion", content: "Recursion is when a function calls itself. Every recursive function needs a base case to stop the recursion.\n\nFactorial example:\nint factorial(int n) {\n    if (n <= 1) return 1;       // base case\n    return n * factorial(n - 1); // recursive case\n}\n\nHow factorial(5) works:\nfactorial(5) = 5 * factorial(4)\n             = 5 * 4 * factorial(3)\n             = 5 * 4 * 3 * factorial(2)\n             = 5 * 4 * 3 * 2 * factorial(1)\n             = 5 * 4 * 3 * 2 * 1\n             = 120\n\nFibonacci example:\nint fibonacci(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nImportant notes:\n- Always define a base case, or you get infinite recursion (stack overflow)\n- Recursion uses more memory than loops (each call adds to the call stack)\n- Some problems are naturally recursive: trees, graphs, divide and conquer" },
          ],
        },
        {
          title: "Arrays and Pointers",
          lessons: [
            { title: "Arrays: Declaration, Initialization, and Traversal", content: "An array is a collection of elements of the same type stored in contiguous memory.\n\nDeclaration and initialization:\nint numbers[5] = {10, 20, 30, 40, 50};\nstring names[3] = {\"Ali\", \"Sara\", \"Omar\"};\n\nAccessing elements (0-indexed):\ncout << numbers[0]; // 10 (first element)\ncout << numbers[4]; // 50 (last element)\n\nTraversing with a for loop:\nfor (int i = 0; i < 5; i++) {\n    cout << numbers[i] << \" \";\n}\n\n2D Arrays (matrices):\nint matrix[3][3] = {\n    {1, 2, 3},\n    {4, 5, 6},\n    {7, 8, 9}\n};\n\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        cout << matrix[i][j] << \" \";\n    }\n    cout << endl;\n}\n\nCommon operations: finding max, min, sum, average, sorting, searching." },
            { title: "Pointers and Memory Addresses", content: "A pointer is a variable that stores the memory address of another variable.\n\nDeclaring pointers:\nint x = 42;\nint *ptr = &x;  // ptr holds the address of x\n\ncout << x;     // 42 (value of x)\ncout << &x;    // 0x7ffd... (address of x)\ncout << ptr;   // 0x7ffd... (same address)\ncout << *ptr;  // 42 (dereferencing: value at the address)\n\nThe & operator: gets the address of a variable\nThe * operator: gets the value at an address (dereferencing)\n\nPointer arithmetic:\nint arr[5] = {10, 20, 30, 40, 50};\nint *p = arr; // points to first element\n\ncout << *p;       // 10\ncout << *(p + 1); // 20\ncout << *(p + 2); // 30\n\nDynamic memory allocation:\nint *p = new int(42);    // allocate on heap\ncout << *p;              // 42\ndelete p;                // free the memory\n\nint *arr = new int[10];  // allocate array on heap\ndelete[] arr;            // free the array" },
          ],
        },
        {
          title: "Object-Oriented Programming Basics",
          lessons: [
            { title: "Classes and Objects", content: "Object-Oriented Programming (OOP) organizes code into classes and objects.\n\nA class is a blueprint. An object is an instance of a class.\n\nclass Student {\npublic:\n    string name;\n    int age;\n    float gpa;\n\n    void display() {\n        cout << name << \", Age: \" << age << \", GPA: \" << gpa << endl;\n    }\n};\n\nint main() {\n    Student s1;\n    s1.name = \"Hamza\";\n    s1.age = 22;\n    s1.gpa = 3.7;\n    s1.display(); // Hamza, Age: 22, GPA: 3.7\n\n    return 0;\n}\n\nConstructors:\nclass Student {\npublic:\n    string name;\n    int age;\n\n    Student(string n, int a) {\n        name = n;\n        age = a;\n    }\n};\n\nStudent s1(\"Hamza\", 22); // constructor called automatically" },
            { title: "Encapsulation and Access Modifiers", content: "Encapsulation means bundling data and methods together and controlling access to them.\n\nAccess modifiers:\n- public: accessible from anywhere\n- private: accessible only within the class\n- protected: accessible within the class and derived classes\n\nclass BankAccount {\nprivate:\n    double balance;\n\npublic:\n    BankAccount(double initial) {\n        balance = initial;\n    }\n\n    void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n            cout << \"Deposited: \" << amount << endl;\n        }\n    }\n\n    void withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            cout << \"Withdrawn: \" << amount << endl;\n        } else {\n            cout << \"Insufficient balance\" << endl;\n        }\n    }\n\n    double getBalance() {\n        return balance;\n    }\n};\n\nThe balance is private so no one can modify it directly. They must use deposit() and withdraw() which have validation logic." },
            { title: "Inheritance and Polymorphism", content: "Inheritance allows a class to inherit properties from another class.\n\nclass Shape {\nprotected:\n    string color;\npublic:\n    Shape(string c) : color(c) {}\n    virtual double area() = 0; // pure virtual function\n    void display() {\n        cout << \"Color: \" << color << \", Area: \" << area() << endl;\n    }\n};\n\nclass Circle : public Shape {\nprivate:\n    double radius;\npublic:\n    Circle(string c, double r) : Shape(c), radius(r) {}\n    double area() override {\n        return 3.14159 * radius * radius;\n    }\n};\n\nclass Rectangle : public Shape {\nprivate:\n    double width, height;\npublic:\n    Rectangle(string c, double w, double h) : Shape(c), width(w), height(h) {}\n    double area() override {\n        return width * height;\n    }\n};\n\nPolymorphism allows treating different objects through a common interface:\nShape *shapes[2];\nshapes[0] = new Circle(\"Red\", 5.0);\nshapes[1] = new Rectangle(\"Blue\", 4.0, 6.0);\n\nfor (int i = 0; i < 2; i++) {\n    shapes[i]->display(); // calls the correct area() for each\n}" },
          ],
        },
      ],
    },

    {
      title: "CS2001: Data Structures",
      slug: "data-structures",
      description: "Master the fundamental data structures used in computer science. This course covers arrays, linked lists, stacks, queues, trees, graphs, hash tables, and heaps. Learn how to choose the right data structure for any problem and analyze time and space complexity. Includes hands-on implementation in C++ with 50+ coding exercises.",
      categorySlug: "data-structures-algorithms",
      instructorIdx: 1,
      price: 0,
      isFree: true,
      level: "Intermediate",
      modules: [
        {
          title: "Introduction to Data Structures",
          lessons: [
            { title: "What are Data Structures and Why Do They Matter?", content: "A data structure is a way of organizing and storing data so that it can be accessed and modified efficiently. The choice of data structure can make the difference between a program that runs in milliseconds and one that takes hours.\n\nTypes of data structures:\n\nLinear: Data elements are arranged sequentially\n- Arrays, Linked Lists, Stacks, Queues\n\nNon-linear: Data elements are not in sequence\n- Trees, Graphs\n\nHash-based: Data is stored using a hash function\n- Hash Tables, Hash Maps\n\nWhy data structures matter:\n- Efficiency: The right structure makes operations faster\n- Scalability: Good structures handle growing data\n- Problem solving: Many algorithms depend on specific structures\n\nReal-world examples:\n- Google Search uses inverted index (hash map)\n- GPS navigation uses graphs\n- Undo/Redo uses stacks\n- Print queue uses queues\n- File system uses trees" },
            { title: "Big-O Notation and Complexity Analysis", content: "Big-O notation describes how the runtime or space usage of an algorithm grows as input size increases.\n\nCommon complexities (fastest to slowest):\n\nO(1) - Constant: Same time regardless of input size\n  Example: Accessing array element by index\n\nO(log n) - Logarithmic: Halves the problem each step\n  Example: Binary search\n\nO(n) - Linear: Time grows proportionally with input\n  Example: Linear search, traversing an array\n\nO(n log n) - Linearithmic: Efficient sorting algorithms\n  Example: Merge sort, Quick sort (average)\n\nO(n^2) - Quadratic: Nested loops over the data\n  Example: Bubble sort, Selection sort\n\nO(2^n) - Exponential: Doubles with each additional element\n  Example: Recursive Fibonacci (naive)\n\nHow to analyze:\n1. Count the basic operations\n2. Focus on the dominant term\n3. Drop constants and lower-order terms\n4. Consider worst case, best case, and average case" },
          ],
        },
        {
          title: "Linked Lists",
          lessons: [
            { title: "Singly Linked Lists", content: "A linked list is a dynamic data structure where each element (node) contains data and a pointer to the next node.\n\nAdvantages over arrays:\n- Dynamic size (grows and shrinks at runtime)\n- Efficient insertion and deletion (no shifting)\n\nDisadvantages:\n- No random access (must traverse from head)\n- Extra memory for pointers\n- Not cache-friendly\n\nNode structure:\nstruct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n\nBasic operations:\n\nInsertion at head - O(1):\nvoid insertAtHead(Node*& head, int val) {\n    Node* newNode = new Node(val);\n    newNode->next = head;\n    head = newNode;\n}\n\nTraversal - O(n):\nvoid display(Node* head) {\n    Node* current = head;\n    while (current != nullptr) {\n        cout << current->data << \" -> \";\n        current = current->next;\n    }\n    cout << \"NULL\" << endl;\n}" },
            { title: "Doubly Linked Lists", content: "A doubly linked list has nodes with pointers to both the next and previous nodes.\n\nstruct DNode {\n    int data;\n    DNode* prev;\n    DNode* next;\n    DNode(int val) : data(val), prev(nullptr), next(nullptr) {}\n};\n\nAdvantages over singly linked lists:\n- Can traverse in both directions\n- Deletion of a node is O(1) if you have the node pointer\n- Can find the last element quickly with a tail pointer\n\nDisadvantages:\n- Extra memory for prev pointer\n- More complex insertion and deletion code\n\nUse cases:\n- Browser history (back and forward)\n- Music playlist (next and previous song)\n- Text editor (undo and redo)" },
            { title: "Circular Linked Lists", content: "In a circular linked list, the last node points back to the first node, forming a circle.\n\nSingly Circular:\nLast node's next points to head instead of nullptr.\n\nDoubly Circular:\nLast node's next points to head, and head's prev points to last node.\n\nUse cases:\n- Round-robin scheduling in operating systems\n- Circular buffers in streaming\n- Board games (players take turns in a cycle)\n- Music playlist on repeat" },
          ],
        },
        {
          title: "Stacks and Queues",
          lessons: [
            { title: "Stack: LIFO Data Structure", content: "A stack follows Last In, First Out (LIFO) principle. Think of a stack of plates: you add and remove from the top only.\n\nOperations:\n- push(x): Add element to top - O(1)\n- pop(): Remove top element - O(1)\n- top()/peek(): View top element without removing - O(1)\n- isEmpty(): Check if stack is empty - O(1)\n\nImplementation using array:\nclass Stack {\nprivate:\n    int arr[1000];\n    int topIdx;\npublic:\n    Stack() : topIdx(-1) {}\n    void push(int x) { arr[++topIdx] = x; }\n    int pop() { return arr[topIdx--]; }\n    int top() { return arr[topIdx]; }\n    bool isEmpty() { return topIdx == -1; }\n};\n\nApplications:\n- Function call stack (recursion)\n- Undo operation in text editors\n- Expression evaluation (postfix, prefix)\n- Balanced parentheses checking\n- Browser back button\n- DFS (Depth-First Search) in graphs" },
            { title: "Queue: FIFO Data Structure", content: "A queue follows First In, First Out (FIFO) principle. Think of a line at a ticket counter: first person in line gets served first.\n\nOperations:\n- enqueue(x): Add element to rear - O(1)\n- dequeue(): Remove element from front - O(1)\n- front(): View front element - O(1)\n- isEmpty(): Check if empty - O(1)\n\nTypes of queues:\n1. Simple Queue: Basic FIFO\n2. Circular Queue: Front and rear wrap around\n3. Priority Queue: Elements have priorities\n4. Deque: Insert/remove from both ends\n\nApplications:\n- Print job scheduling\n- CPU task scheduling\n- BFS (Breadth-First Search) in graphs\n- Message queues in distributed systems\n- Customer service call centers\n- Buffering in streaming services" },
          ],
          quiz: {
            title: "Stacks and Queues Quiz",
            passMark: 70,
            questions: [
              { text: "Which principle does a Stack follow?", type: "MCQ", options: [{ text: "FIFO", isCorrect: false }, { text: "LIFO", isCorrect: true }, { text: "LILO", isCorrect: false }, { text: "Random", isCorrect: false }] },
              { text: "A Queue follows FIFO (First In, First Out) principle", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
              { text: "Which operation adds an element to a stack?", type: "MCQ", options: [{ text: "enqueue", isCorrect: false }, { text: "push", isCorrect: true }, { text: "insert", isCorrect: false }, { text: "add", isCorrect: false }] },
            ],
          },
        },
        {
          title: "Trees",
          lessons: [
            { title: "Binary Trees and Binary Search Trees", content: "A tree is a hierarchical data structure with a root node and child nodes. A binary tree has at most two children per node (left and right).\n\nBinary Search Tree (BST) property:\n- Left subtree contains nodes with values less than the parent\n- Right subtree contains nodes with values greater than the parent\n\nstruct TreeNode {\n    int data;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}\n};\n\nBST Operations:\n- Search: O(log n) average, O(n) worst\n- Insert: O(log n) average\n- Delete: O(log n) average\n\nTree traversals:\n- Inorder (Left, Root, Right): Gives sorted order in BST\n- Preorder (Root, Left, Right): Used for copying trees\n- Postorder (Left, Right, Root): Used for deleting trees\n- Level order: Uses queue, visits level by level" },
            { title: "AVL Trees and Self-Balancing", content: "An AVL tree is a self-balancing BST where the height difference between left and right subtrees of any node is at most 1.\n\nBalance Factor = Height(Left Subtree) - Height(Right Subtree)\nValid values: -1, 0, 1\n\nWhen the balance factor goes outside this range, we perform rotations:\n\n1. Left Rotation (RR case): When right subtree is too heavy\n2. Right Rotation (LL case): When left subtree is too heavy\n3. Left-Right Rotation (LR case): Left child is right-heavy\n4. Right-Left Rotation (RL case): Right child is left-heavy\n\nTime complexity for all operations: O(log n) guaranteed\n\nUse cases:\n- Database indexing\n- In-memory sorted data\n- Where guaranteed O(log n) operations are needed" },
          ],
        },
        {
          title: "Graphs",
          lessons: [
            { title: "Graph Representation and Traversal", content: "A graph is a collection of vertices (nodes) connected by edges. Graphs can be directed or undirected, weighted or unweighted.\n\nRepresentations:\n\n1. Adjacency Matrix: 2D array where matrix[i][j] = 1 if there is an edge from i to j\n   - Space: O(V^2)\n   - Edge lookup: O(1)\n   - Good for dense graphs\n\n2. Adjacency List: Array of lists where each list contains neighbors\n   - Space: O(V + E)\n   - Edge lookup: O(degree)\n   - Good for sparse graphs\n\nGraph Traversals:\n\nBFS (Breadth-First Search):\n- Uses a queue\n- Visits neighbors first, then their neighbors\n- Finds shortest path in unweighted graphs\n- Time: O(V + E)\n\nDFS (Depth-First Search):\n- Uses a stack (or recursion)\n- Goes as deep as possible before backtracking\n- Used for cycle detection, topological sort\n- Time: O(V + E)" },
            { title: "Shortest Path Algorithms", content: "Finding the shortest path between two nodes is one of the most important graph problems.\n\nDijkstra's Algorithm:\n- Finds shortest path from source to all vertices\n- Works with non-negative weights\n- Uses a priority queue (min-heap)\n- Time: O((V + E) log V)\n\nBellman-Ford Algorithm:\n- Handles negative edge weights\n- Can detect negative cycles\n- Time: O(V * E)\n\nFloyd-Warshall Algorithm:\n- Finds shortest paths between ALL pairs of vertices\n- Uses dynamic programming\n- Time: O(V^3)\n\nReal-world applications:\n- Google Maps: Dijkstra/A* for navigation\n- Network routing: Finding optimal data paths\n- Social networks: Degrees of separation\n- Flight booking: Cheapest route with layovers" },
          ],
        },
      ],
    },

    {
      title: "CS3001: Computer Networks",
      slug: "computer-networks",
      description: "Understand how the internet works from the ground up. This course covers the OSI model, TCP/IP protocol suite, routing algorithms, network security, and modern networking concepts. Learn about HTTP, DNS, DHCP, firewalls, VPNs, and wireless networking through practical examples and Wireshark labs.",
      categorySlug: "computer-networks",
      instructorIdx: 0,
      price: 14.99,
      isFree: false,
      level: "Intermediate",
      modules: [
        {
          title: "Network Fundamentals",
          lessons: [
            { title: "Introduction to Computer Networks", content: "A computer network is a collection of interconnected devices that can communicate and share resources. Networks range from small home networks to the global internet.\n\nTypes of networks:\n- PAN (Personal Area Network): Bluetooth devices, ~10m\n- LAN (Local Area Network): Office, home, ~100m-1km\n- MAN (Metropolitan Area Network): City-wide, ~10-100km\n- WAN (Wide Area Network): Countries, continents\n- The Internet: Global network of networks\n\nNetwork topologies:\n- Star: All devices connect to a central hub/switch\n- Bus: All devices share a single cable\n- Ring: Devices form a circular loop\n- Mesh: Every device connects to every other\n- Hybrid: Combination of topologies\n\nKey networking devices:\n- Hub: Broadcasts to all ports (Layer 1)\n- Switch: Forwards to specific port using MAC (Layer 2)\n- Router: Routes between networks using IP (Layer 3)\n- Firewall: Filters traffic based on rules\n- Access Point: Provides wireless connectivity" },
            { title: "The OSI Model (7 Layers)", content: "The OSI (Open Systems Interconnection) model divides network communication into 7 layers. Each layer has a specific function.\n\nLayer 7 - Application: User-facing protocols\n  HTTP, FTP, SMTP, DNS, DHCP\n  Data unit: Data\n\nLayer 6 - Presentation: Data formatting and encryption\n  SSL/TLS, JPEG, ASCII, encryption\n  Data unit: Data\n\nLayer 5 - Session: Managing connections\n  NetBIOS, RPC, session management\n  Data unit: Data\n\nLayer 4 - Transport: Reliable delivery\n  TCP (reliable), UDP (fast)\n  Data unit: Segment\n\nLayer 3 - Network: Routing and addressing\n  IP, ICMP, routing protocols\n  Data unit: Packet\n\nLayer 2 - Data Link: Local delivery\n  Ethernet, Wi-Fi, MAC addresses\n  Data unit: Frame\n\nLayer 1 - Physical: Bits on the wire\n  Cables, signals, voltages\n  Data unit: Bit\n\nMemory trick: Please Do Not Throw Sausage Pizza Away (bottom to top)" },
          ],
        },
        {
          title: "TCP/IP and Transport Layer",
          lessons: [
            { title: "TCP vs UDP", content: "TCP (Transmission Control Protocol):\n- Connection-oriented (3-way handshake)\n- Reliable delivery (acknowledgments, retransmission)\n- Ordered delivery (sequence numbers)\n- Flow control and congestion control\n- Slower but guaranteed delivery\n- Used for: Web (HTTP), Email (SMTP), File transfer (FTP)\n\nUDP (User Datagram Protocol):\n- Connectionless (no handshake)\n- Unreliable (no acknowledgments)\n- No ordering guarantee\n- No flow/congestion control\n- Faster, lower overhead\n- Used for: Video streaming, Gaming, DNS, VoIP\n\nTCP 3-way handshake:\n1. Client sends SYN\n2. Server responds with SYN-ACK\n3. Client sends ACK\nConnection established.\n\nTCP connection termination (4-way):\n1. Client sends FIN\n2. Server sends ACK\n3. Server sends FIN\n4. Client sends ACK" },
            { title: "IP Addressing and Subnetting", content: "An IP address is a unique identifier for a device on a network.\n\nIPv4: 32-bit address, written as four octets\nExample: 192.168.1.100\n\nClasses:\nClass A: 1.0.0.0 to 126.255.255.255 (large networks)\nClass B: 128.0.0.0 to 191.255.255.255 (medium networks)\nClass C: 192.0.0.0 to 223.255.255.255 (small networks)\n\nPrivate IP ranges (not routable on internet):\n10.0.0.0 to 10.255.255.255\n172.16.0.0 to 172.31.255.255\n192.168.0.0 to 192.168.255.255\n\nSubnet mask determines which part is network vs host:\n255.255.255.0 = /24 (256 addresses, 254 usable)\n255.255.0.0 = /16 (65,536 addresses)\n\nCIDR notation: 192.168.1.0/24\n\nIPv6: 128-bit address\nExample: 2001:0db8:85a3:0000:0000:8a2e:0370:7334\n- Solves IPv4 exhaustion (3.4 x 10^38 addresses)\n- No need for NAT\n- Built-in IPsec" },
          ],
        },
        {
          title: "Application Layer Protocols",
          lessons: [
            { title: "HTTP and HTTPS", content: "HTTP (HyperText Transfer Protocol) is the foundation of web communication.\n\nHTTP Methods:\n- GET: Retrieve data\n- POST: Send data to create a resource\n- PUT: Update/replace a resource\n- PATCH: Partially update a resource\n- DELETE: Remove a resource\n\nHTTP Status Codes:\n2xx Success: 200 OK, 201 Created, 204 No Content\n3xx Redirect: 301 Moved Permanently, 302 Found\n4xx Client Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n5xx Server Error: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable\n\nHTTPS = HTTP + TLS/SSL encryption\n- Encrypts data in transit\n- Uses certificates for authentication\n- Port 443 (HTTP uses port 80)\n- Required for sensitive data (passwords, payments)\n\nHTTP/2 improvements:\n- Multiplexing (multiple requests over one connection)\n- Header compression\n- Server push" },
            { title: "DNS: The Internet's Phone Book", content: "DNS (Domain Name System) translates human-readable domain names to IP addresses.\n\ngoogle.com -> 142.250.185.46\n\nDNS Resolution Process:\n1. Browser checks its cache\n2. OS checks its cache\n3. Query sent to Recursive DNS Resolver (ISP)\n4. Resolver queries Root DNS Server (.)\n5. Root server directs to TLD server (.com)\n6. TLD server directs to Authoritative Name Server\n7. Authoritative server returns the IP address\n8. Result cached at each level\n\nDNS Record Types:\n- A: Maps domain to IPv4 address\n- AAAA: Maps domain to IPv6 address\n- CNAME: Alias for another domain\n- MX: Mail server for the domain\n- TXT: Text records (SPF, DKIM verification)\n- NS: Name servers for the domain\n\nDNS uses UDP port 53 (TCP for zone transfers)\nTypical DNS lookup takes 20-120 milliseconds" },
          ],
        },
      ],
    },

    {
      title: "AI2002: Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "Explore the fascinating world of Artificial Intelligence. This course covers search algorithms, knowledge representation, machine learning fundamentals, neural networks, natural language processing, and computer vision. Learn to build intelligent agents that can reason, learn, and make decisions.",
      categorySlug: "artificial-intelligence",
      instructorIdx: 2,
      price: 19.99,
      isFree: false,
      level: "Advanced",
      modules: [
        {
          title: "Introduction to AI",
          lessons: [
            { title: "What is Artificial Intelligence?", content: "Artificial Intelligence is the science of creating machines that can perform tasks that typically require human intelligence.\n\nTypes of AI:\n\n1. Narrow AI (Weak AI): Designed for a specific task\n   Examples: Siri, Chess engines, Spam filters, Recommendation systems\n   This is what we have today.\n\n2. General AI (Strong AI): Human-level intelligence across all domains\n   Can reason, plan, learn, and understand like a human.\n   Does not exist yet.\n\n3. Super AI: Surpasses human intelligence in all aspects\n   Hypothetical, subject of much debate.\n\nKey areas of AI:\n- Machine Learning: Systems that learn from data\n- Deep Learning: Neural networks with many layers\n- Natural Language Processing: Understanding human language\n- Computer Vision: Understanding images and video\n- Robotics: Physical agents that interact with the world\n- Expert Systems: Rule-based decision making\n\nHistorical milestones:\n1950: Turing Test proposed\n1997: Deep Blue beats Kasparov at chess\n2011: IBM Watson wins Jeopardy\n2016: AlphaGo beats world Go champion\n2022: ChatGPT launches, transforming AI accessibility" },
            { title: "Intelligent Agents", content: "An intelligent agent is anything that perceives its environment through sensors and acts upon it through actuators.\n\nAgent components:\n- Sensors: How the agent perceives (camera, microphone, keyboard input)\n- Actuators: How the agent acts (motors, display, speakers)\n- Agent function: Maps percept sequences to actions\n- Agent program: Implementation of the agent function\n\nTypes of agents:\n\n1. Simple Reflex Agent: Acts based on current percept only\n   if (dirty) then clean()\n\n2. Model-based Reflex Agent: Maintains internal state\n   Tracks how the world evolves\n\n3. Goal-based Agent: Acts to achieve goals\n   Plans actions to reach a desired state\n\n4. Utility-based Agent: Maximizes a utility function\n   Chooses the action with the highest expected utility\n\n5. Learning Agent: Improves performance over time\n   Has a learning element that modifies the agent\n\nPEAS description for agents:\n- Performance measure: How success is measured\n- Environment: Where the agent operates\n- Actuators: How the agent acts\n- Sensors: How the agent perceives" },
          ],
        },
        {
          title: "Search Algorithms",
          lessons: [
            { title: "Uninformed Search: BFS, DFS, UCS", content: "Search algorithms find a path from an initial state to a goal state.\n\nBreadth-First Search (BFS):\n- Explores all nodes at current depth before going deeper\n- Uses a queue (FIFO)\n- Complete: Yes (will find a solution if one exists)\n- Optimal: Yes (finds shortest path in unweighted graphs)\n- Time: O(b^d), Space: O(b^d)\n  where b = branching factor, d = depth of solution\n\nDepth-First Search (DFS):\n- Explores as deep as possible before backtracking\n- Uses a stack (LIFO) or recursion\n- Complete: No (can get stuck in infinite paths)\n- Optimal: No\n- Time: O(b^m), Space: O(bm)\n  where m = maximum depth\n\nUniform Cost Search (UCS):\n- Expands the node with lowest path cost\n- Uses a priority queue\n- Complete: Yes\n- Optimal: Yes\n- Like BFS but considers edge weights\n\nDepth-Limited Search: DFS with a depth limit\nIterative Deepening: Repeated DFS with increasing depth limits\n  Combines BFS completeness with DFS space efficiency" },
            { title: "Informed Search: A* Algorithm", content: "Informed search uses heuristics to guide the search toward the goal more efficiently.\n\nGreedy Best-First Search:\n- Expands the node closest to goal (by heuristic)\n- f(n) = h(n) where h(n) is the heuristic estimate\n- Fast but not optimal\n\nA* Search:\n- Combines path cost and heuristic\n- f(n) = g(n) + h(n)\n  g(n) = cost from start to n\n  h(n) = estimated cost from n to goal\n- Complete: Yes\n- Optimal: Yes (if heuristic is admissible)\n\nAdmissible heuristic: Never overestimates the true cost\nConsistent heuristic: h(n) <= cost(n, n') + h(n')\n\nCommon heuristics:\n- Manhattan distance: |x1-x2| + |y1-y2|\n  Used for grid-based movement (4 directions)\n- Euclidean distance: sqrt((x1-x2)^2 + (y1-y2)^2)\n  Used for free movement\n- Misplaced tiles: Number of tiles in wrong position\n  Used for puzzle problems\n\nA* is the most widely used pathfinding algorithm in games, robotics, and navigation systems." },
          ],
        },
        {
          title: "Machine Learning Basics",
          lessons: [
            { title: "Supervised vs Unsupervised Learning", content: "Machine Learning is a subset of AI where systems learn patterns from data without being explicitly programmed.\n\nSupervised Learning:\n- Training data has input-output pairs (labeled data)\n- The model learns to map inputs to outputs\n- Types:\n  - Classification: Predicting categories (spam/not spam, cat/dog)\n  - Regression: Predicting continuous values (house price, temperature)\n- Algorithms: Linear Regression, Decision Trees, SVM, Random Forest, Neural Networks\n\nUnsupervised Learning:\n- Training data has no labels\n- The model finds patterns and structure on its own\n- Types:\n  - Clustering: Grouping similar data (customer segments)\n  - Dimensionality Reduction: Reducing features (PCA)\n  - Association: Finding rules (market basket analysis)\n- Algorithms: K-Means, DBSCAN, Hierarchical Clustering, PCA\n\nReinforcement Learning:\n- Agent learns by interacting with an environment\n- Receives rewards or penalties for actions\n- Goal: Maximize cumulative reward\n- Used in: Game playing, robotics, autonomous driving" },
            { title: "Neural Networks and Deep Learning", content: "A neural network is inspired by the human brain. It consists of layers of interconnected nodes (neurons).\n\nStructure:\n- Input layer: Receives the data\n- Hidden layers: Process the data (feature extraction)\n- Output layer: Produces the result\n\nHow a neuron works:\n1. Receives inputs (x1, x2, ..., xn)\n2. Multiplies each by a weight (w1, w2, ..., wn)\n3. Adds a bias (b)\n4. Applies activation function: output = f(sum(wi*xi) + b)\n\nActivation functions:\n- Sigmoid: f(x) = 1 / (1 + e^(-x)), output 0 to 1\n- ReLU: f(x) = max(0, x), most commonly used\n- Tanh: f(x) = (e^x - e^(-x)) / (e^x + e^(-x)), output -1 to 1\n- Softmax: Converts to probabilities (for classification)\n\nTraining process:\n1. Forward pass: Input flows through network, produces output\n2. Loss calculation: Compare output with expected result\n3. Backpropagation: Calculate gradients of loss\n4. Update weights: Adjust weights to reduce loss\n5. Repeat for many epochs\n\nDeep Learning = Neural networks with many hidden layers\nEnabled by: Big data, GPU computing, better algorithms" },
          ],
        },
      ],
    },

    {
      title: "CS3002: Information Security",
      slug: "information-security",
      description: "Learn to protect systems, networks, and data from cyber threats. This course covers cryptography, network security, web application security, ethical hacking, and security policies. Understand common attack vectors and how to defend against them.",
      categorySlug: "cybersecurity",
      instructorIdx: 4,
      price: 24.99,
      isFree: false,
      level: "Advanced",
      modules: [
        {
          title: "Cryptography Fundamentals",
          lessons: [
            { title: "Symmetric vs Asymmetric Encryption", content: "Cryptography is the practice of securing communication so that only intended recipients can read it.\n\nSymmetric Encryption (Same key for encrypt and decrypt):\n- Fast, efficient for large data\n- Key distribution is the challenge\n- Algorithms: AES (128/256-bit), DES, 3DES, Blowfish\n- AES-256 is the gold standard\n\nAsymmetric Encryption (Public/Private key pair):\n- Public key encrypts, private key decrypts\n- Slower but solves key distribution\n- Algorithms: RSA, ECC, Diffie-Hellman\n- Used for: Digital signatures, TLS handshake, SSH\n\nHybrid approach (used in practice):\n1. Use asymmetric encryption to exchange a symmetric key\n2. Use the symmetric key for actual data encryption\n3. This is how HTTPS works\n\nHash Functions (one-way):\n- Produce a fixed-size output from any input\n- Cannot be reversed\n- MD5 (broken), SHA-1 (deprecated), SHA-256 (current standard)\n- Used for: Password storage, file integrity, digital signatures" },
            { title: "Digital Signatures and Certificates", content: "A digital signature proves that a message came from the claimed sender and was not modified.\n\nHow digital signatures work:\n1. Sender hashes the message\n2. Sender encrypts the hash with their private key (this is the signature)\n3. Sender sends the message + signature\n4. Receiver decrypts the signature with sender's public key\n5. Receiver hashes the received message\n6. If the hashes match, the message is authentic and unmodified\n\nDigital Certificates:\n- A certificate binds a public key to an identity\n- Issued by Certificate Authorities (CAs) like DigiCert, Let's Encrypt\n- Contains: Owner name, public key, CA signature, validity period\n- Used in HTTPS (SSL/TLS certificates)\n\nCertificate chain:\n1. Root CA (trusted, self-signed)\n2. Intermediate CA (signed by Root)\n3. End-entity certificate (signed by Intermediate)\n\nPKI (Public Key Infrastructure):\nThe framework for creating, managing, distributing, and revoking digital certificates." },
          ],
        },
        {
          title: "Network Security",
          lessons: [
            { title: "Common Network Attacks", content: "Understanding attacks is essential for building defenses.\n\nDDoS (Distributed Denial of Service):\n- Overwhelms a server with traffic from many sources\n- Types: Volumetric, Protocol, Application layer\n- Defense: CDN, rate limiting, traffic filtering\n\nMan-in-the-Middle (MITM):\n- Attacker intercepts communication between two parties\n- Can read, modify, or inject messages\n- Defense: HTTPS, certificate pinning, HSTS\n\nDNS Spoofing:\n- Attacker corrupts DNS cache with false entries\n- Redirects users to malicious sites\n- Defense: DNSSEC, DNS over HTTPS (DoH)\n\nARP Spoofing:\n- Attacker sends fake ARP messages on local network\n- Links attacker's MAC to victim's IP\n- Defense: Static ARP entries, ARP inspection\n\nSQL Injection:\n- Attacker injects SQL code through user input\n- Can read, modify, or delete database data\n- Defense: Parameterized queries, input validation, ORM\n\nXSS (Cross-Site Scripting):\n- Attacker injects malicious scripts into web pages\n- Scripts execute in victim's browser\n- Defense: Output encoding, CSP headers, input sanitization" },
            { title: "Firewalls and Intrusion Detection", content: "Firewalls are the first line of defense in network security.\n\nTypes of firewalls:\n1. Packet Filtering: Examines headers (IP, port, protocol)\n   Simple rules: Allow/Deny based on source/destination\n\n2. Stateful Inspection: Tracks connection state\n   Understands TCP handshake, allows related packets\n\n3. Application Layer (WAF): Inspects application data\n   Can detect SQL injection, XSS in HTTP traffic\n\n4. Next-Generation (NGFW): Combines all above\n   Deep packet inspection, application awareness, threat intelligence\n\nIDS vs IPS:\n\nIDS (Intrusion Detection System):\n- Monitors and alerts on suspicious activity\n- Passive (does not block traffic)\n- Types: Network-based (NIDS), Host-based (HIDS)\n\nIPS (Intrusion Prevention System):\n- Monitors AND blocks suspicious activity\n- Active (can drop packets, reset connections)\n- Inline with network traffic\n\nCommon IDS/IPS tools: Snort, Suricata, OSSEC\n\nSIEM (Security Information and Event Management):\n- Collects logs from all security devices\n- Correlates events to detect complex attacks\n- Examples: Splunk, ELK Stack, IBM QRadar" },
          ],
        },
      ],
    },

    {
      title: "CS3009: Software Engineering",
      slug: "software-engineering",
      description: "Learn the principles and practices of building high-quality software systems. This course covers software development life cycles, requirements engineering, system design, testing strategies, agile methodologies, and project management. Essential for anyone who wants to build production-grade software.",
      categorySlug: "software-engineering",
      instructorIdx: 0,
      price: 0,
      isFree: true,
      level: "Intermediate",
      modules: [
        {
          title: "Software Development Life Cycle",
          lessons: [
            { title: "SDLC Models: Waterfall, Agile, and Beyond", content: "The Software Development Life Cycle (SDLC) is a framework for planning, creating, testing, and deploying software.\n\nWaterfall Model:\n1. Requirements -> 2. Design -> 3. Implementation -> 4. Testing -> 5. Deployment -> 6. Maintenance\n- Sequential, each phase completes before the next begins\n- Works well when requirements are clear and unlikely to change\n- Difficult to go back to a previous phase\n\nAgile Model:\n- Iterative and incremental development\n- Work is divided into short sprints (2-4 weeks)\n- Continuous feedback from stakeholders\n- Embraces changing requirements\n- Popular frameworks: Scrum, Kanban, XP\n\nScrum Roles:\n- Product Owner: Defines what to build (manages backlog)\n- Scrum Master: Facilitates the process, removes blockers\n- Development Team: Builds the product (3-9 people)\n\nScrum Events:\n- Sprint Planning: What to build this sprint\n- Daily Standup: 15-min sync (What did I do? What will I do? Blockers?)\n- Sprint Review: Demo to stakeholders\n- Sprint Retrospective: How to improve\n\nOther models: V-Model, Spiral, DevOps, RAD (Rapid Application Development)" },
            { title: "Requirements Engineering", content: "Requirements engineering is the process of defining, documenting, and maintaining software requirements.\n\nTypes of requirements:\n\nFunctional Requirements:\n- What the system should DO\n- Example: Users can register with email and password\n- Example: The system sends email notifications on new enrollment\n\nNon-Functional Requirements:\n- How the system should PERFORM\n- Performance: Page load time under 2 seconds\n- Scalability: Support 10,000 concurrent users\n- Security: All data encrypted in transit (HTTPS)\n- Availability: 99.9% uptime\n- Usability: Mobile-responsive design\n\nRequirements gathering techniques:\n- Interviews with stakeholders\n- Surveys and questionnaires\n- Observation of existing workflows\n- Prototyping and wireframes\n- Use case analysis\n- User stories (As a [role], I want [feature] so that [benefit])\n\nSRS (Software Requirements Specification):\n- Formal document capturing all requirements\n- Serves as a contract between client and development team\n- IEEE 830 standard provides a template" },
          ],
        },
        {
          title: "Testing and Quality Assurance",
          lessons: [
            { title: "Testing Levels and Strategies", content: "Software testing ensures the system works as expected and catches bugs before users do.\n\nTesting Levels (Testing Pyramid):\n\n1. Unit Testing (base of pyramid):\n   - Tests individual functions/methods\n   - Written by developers\n   - Fast, automated, run frequently\n   - Tools: Jest, JUnit, PyTest, Google Test\n\n2. Integration Testing:\n   - Tests how modules work together\n   - API testing, database integration\n   - Tools: Supertest, Postman, REST Assured\n\n3. System Testing:\n   - Tests the complete integrated system\n   - End-to-end testing of all features\n   - Tools: Selenium, Cypress, Playwright\n\n4. Acceptance Testing (top of pyramid):\n   - Validates the system meets business requirements\n   - Done by stakeholders or QA team\n   - UAT (User Acceptance Testing)\n\nTesting approaches:\n- Black Box: Test without knowing internal code\n- White Box: Test with knowledge of internal code\n- Gray Box: Partial knowledge of internals\n\nTest-Driven Development (TDD):\n1. Write a failing test\n2. Write minimum code to pass\n3. Refactor\n4. Repeat" },
          ],
        },
      ],
    },

    {
      title: "CS4075: Cloud Computing",
      slug: "cloud-computing",
      description: "Learn cloud computing from the ground up. This course covers cloud service models (IaaS, PaaS, SaaS), major cloud providers (AWS, Azure, GCP), containerization with Docker, orchestration with Kubernetes, CI/CD pipelines, and serverless computing. Hands-on labs with real cloud deployments.",
      categorySlug: "cloud-computing-devops",
      instructorIdx: 3,
      price: 29.99,
      isFree: false,
      level: "Advanced",
      modules: [
        {
          title: "Cloud Computing Fundamentals",
          lessons: [
            { title: "Introduction to Cloud Computing", content: "Cloud computing is the delivery of computing services over the internet: servers, storage, databases, networking, software, and more.\n\nService Models:\n\nIaaS (Infrastructure as a Service):\n- Raw computing resources: VMs, storage, networking\n- You manage: OS, middleware, applications\n- Examples: AWS EC2, Azure VMs, Google Compute Engine\n\nPaaS (Platform as a Service):\n- Platform for building applications\n- Provider manages: OS, middleware, runtime\n- You manage: Applications and data\n- Examples: Heroku, Google App Engine, Azure App Service\n\nSaaS (Software as a Service):\n- Complete applications delivered over the internet\n- Provider manages everything\n- Examples: Gmail, Salesforce, Slack, Dropbox\n\nDeployment Models:\n- Public Cloud: Shared infrastructure (AWS, Azure, GCP)\n- Private Cloud: Dedicated infrastructure for one organization\n- Hybrid Cloud: Combination of public and private\n- Multi-Cloud: Using multiple cloud providers\n\nBenefits:\n- Pay-as-you-go pricing\n- Elastic scalability\n- Global availability\n- No upfront hardware costs\n- Managed security and compliance" },
            { title: "AWS Core Services", content: "Amazon Web Services (AWS) is the largest cloud provider with 200+ services.\n\nCompute:\n- EC2: Virtual servers (instances)\n- Lambda: Serverless functions (pay per execution)\n- ECS/EKS: Container services (Docker/Kubernetes)\n- Elastic Beanstalk: PaaS for web apps\n\nStorage:\n- S3: Object storage (files, images, backups)\n- EBS: Block storage for EC2 instances\n- EFS: Shared file storage\n- Glacier: Low-cost archive storage\n\nDatabase:\n- RDS: Managed relational databases (MySQL, PostgreSQL)\n- DynamoDB: NoSQL key-value database\n- ElastiCache: In-memory caching (Redis, Memcached)\n- Aurora: High-performance MySQL/PostgreSQL compatible\n\nNetworking:\n- VPC: Virtual Private Cloud (isolated network)\n- Route 53: DNS service\n- CloudFront: CDN (Content Delivery Network)\n- ELB: Load balancer\n\nSecurity:\n- IAM: Identity and Access Management\n- KMS: Key Management Service\n- WAF: Web Application Firewall\n- Shield: DDoS protection" },
          ],
        },
        {
          title: "Containers and DevOps",
          lessons: [
            { title: "Docker: Containerization", content: "Docker packages applications and their dependencies into containers that run consistently anywhere.\n\nVMs vs Containers:\n- VMs: Each has its own OS (heavy, slow to start, GBs)\n- Containers: Share host OS kernel (lightweight, fast, MBs)\n\nKey concepts:\n- Image: Blueprint for a container (read-only template)\n- Container: Running instance of an image\n- Dockerfile: Instructions to build an image\n- Registry: Repository for images (Docker Hub)\n\nBasic Dockerfile:\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n\nEssential commands:\ndocker build -t myapp .        # Build image\ndocker run -p 3000:3000 myapp  # Run container\ndocker ps                       # List running containers\ndocker stop <id>                # Stop a container\ndocker images                   # List images\ndocker-compose up               # Run multi-container app\n\nDocker Compose:\nDefine and run multi-container applications.\n- Web server + Database + Redis in one command\n- docker-compose.yml defines all services" },
            { title: "CI/CD Pipelines", content: "CI/CD automates the process of building, testing, and deploying code.\n\nCI (Continuous Integration):\n- Developers merge code to main branch frequently\n- Each merge triggers automated build and tests\n- Catches integration issues early\n- Tools: GitHub Actions, Jenkins, GitLab CI, CircleCI\n\nCD (Continuous Delivery):\n- Code is always in a deployable state\n- Deployment to production requires manual approval\n- Reduces risk of large, infrequent releases\n\nCD (Continuous Deployment):\n- Every change that passes tests is automatically deployed\n- No manual intervention\n- Requires high test confidence\n\nTypical CI/CD Pipeline:\n1. Developer pushes code to Git\n2. CI server detects the push\n3. Build: Compile code, build Docker image\n4. Test: Run unit tests, integration tests\n5. Analyze: Code quality, security scanning\n6. Deploy to staging: Test in production-like environment\n7. Deploy to production: Release to users\n\nGitHub Actions example:\nname: Deploy\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install\n      - run: npm test\n      - run: npm run build" },
          ],
        },
      ],
    },

    {
      title: "CS2005: Database Systems",
      slug: "database-systems",
      description: "Master relational database design, SQL, normalization, transactions, and indexing. This course also covers NoSQL databases, database security, and performance optimization. Build practical database skills with hands-on projects using PostgreSQL and MongoDB.",
      categorySlug: "database-systems",
      instructorIdx: 1,
      price: 0,
      isFree: true,
      level: "Intermediate",
      modules: [
        {
          title: "Relational Database Fundamentals",
          lessons: [
            { title: "Introduction to Databases and SQL", content: "A database is an organized collection of structured data stored electronically.\n\nRelational Database Management Systems (RDBMS):\n- Store data in tables with rows and columns\n- Tables are related through foreign keys\n- Use SQL (Structured Query Language) for operations\n- Examples: PostgreSQL, MySQL, SQLite, Oracle, SQL Server\n\nSQL Categories:\n\nDDL (Data Definition Language):\nCREATE TABLE students (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(150) UNIQUE,\n    age INT CHECK (age >= 16),\n    gpa DECIMAL(3,2) DEFAULT 0.00,\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\nDML (Data Manipulation Language):\nINSERT INTO students (name, email, age) VALUES ('Hamza', 'hamza@email.com', 22);\nSELECT * FROM students WHERE gpa > 3.0 ORDER BY name;\nUPDATE students SET gpa = 3.85 WHERE id = 1;\nDELETE FROM students WHERE id = 5;\n\nJOINs:\nSELECT s.name, c.title\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON e.course_id = c.id;" },
            { title: "Normalization and Database Design", content: "Normalization organizes database tables to reduce redundancy and dependency.\n\n1NF (First Normal Form):\n- Each column contains atomic (indivisible) values\n- Each row is unique\n- No repeating groups\n\n2NF (Second Normal Form):\n- Must be in 1NF\n- No partial dependency (non-key columns depend on ALL of the primary key)\n\n3NF (Third Normal Form):\n- Must be in 2NF\n- No transitive dependency (non-key columns depend only on the primary key, not on other non-key columns)\n\nBCNF (Boyce-Codd Normal Form):\n- Stricter version of 3NF\n- Every determinant must be a candidate key\n\nER Diagrams (Entity-Relationship):\n- Entities: Tables (rectangles)\n- Attributes: Columns (ovals)\n- Relationships: How tables connect (diamonds)\n- Cardinality: 1:1, 1:N, M:N\n\nDesign best practices:\n- Use meaningful table and column names\n- Always have a primary key\n- Use appropriate data types\n- Index frequently queried columns\n- Use foreign keys for referential integrity\n- Normalize to 3NF for most applications" },
          ],
        },
      ],
    },
  ];

  let totalCourses = 0;
  let totalModules = 0;
  let totalLessons = 0;
  let totalQuizzes = 0;

  for (const cd of coursesData) {
    const existing = await prisma.course.findUnique({ where: { slug: cd.slug } });
    if (existing) {
      console.log(`  Skipping "${cd.title}" (already exists)`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        title: cd.title,
        slug: cd.slug,
        description: cd.description,
        price: cd.price,
        isFree: cd.isFree,
        level: cd.level,
        status: "PUBLISHED",
        instructorId: instructors[cd.instructorIdx].id,
        categoryId: catMap[cd.categorySlug],
      },
    });
    totalCourses++;

    for (let mi = 0; mi < cd.modules.length; mi++) {
      const modData = cd.modules[mi];
      const mod = await prisma.module.create({
        data: { title: modData.title, position: mi, courseId: course.id },
      });
      totalModules++;

      for (let li = 0; li < modData.lessons.length; li++) {
        const lesData = modData.lessons[li];
        await prisma.lesson.create({
          data: {
            title: lesData.title,
            content: lesData.content,
            position: li,
            isFree: li === 0,
            moduleId: mod.id,
          },
        });
        totalLessons++;
      }

      if (modData.quiz) {
        await prisma.quiz.create({
          data: {
            title: modData.quiz.title,
            passMark: modData.quiz.passMark,
            moduleId: mod.id,
            questions: {
              create: modData.quiz.questions.map((q, qi) => ({
                text: q.text,
                type: q.type,
                points: 1,
                position: qi,
                options: { create: q.options },
              })),
            },
          },
        });
        totalQuizzes++;
      }
    }

    // Enroll random students
    const enrollCount = Math.floor(Math.random() * students.length) + 2;
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(enrollCount, shuffled.length); i++) {
      try {
        const progress = Math.floor(Math.random() * 100);
        await prisma.enrollment.create({
          data: {
            userId: shuffled[i].id,
            courseId: course.id,
            progress,
            status: progress === 100 ? "COMPLETED" : "ACTIVE",
            completedAt: progress === 100 ? new Date() : null,
          },
        });

        // Add a review from some enrolled students
        if (Math.random() > 0.4) {
          const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
          const comments = [
            "Excellent course! Very well structured and easy to follow.",
            "Great content. The explanations are clear and the examples are practical.",
            "Learned a lot from this course. Highly recommended for beginners.",
            "The instructor explains complex concepts in a simple way.",
            "Good course overall. Would love more hands-on exercises.",
            "Very thorough coverage of the topic. Worth every minute.",
            "One of the best courses I have taken on this platform.",
            "Clear, concise, and well-organized. Great for self-study.",
          ];
          await prisma.review.create({
            data: {
              userId: shuffled[i].id,
              courseId: course.id,
              rating,
              comment: comments[Math.floor(Math.random() * comments.length)],
            },
          });
        }
      } catch (e) {
        // skip duplicate enrollment
      }
    }

    console.log(`  Created: ${cd.title} (${cd.modules.length} modules, ${cd.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons)`);
  }

  console.log(`\nSeed complete!`);
  console.log(`  Courses: ${totalCourses}`);
  console.log(`  Modules: ${totalModules}`);
  console.log(`  Lessons: ${totalLessons}`);
  console.log(`  Quizzes: ${totalQuizzes}`);
  console.log(`  Instructors: ${instructors.length}`);
  console.log(`  Students: ${students.length}`);
  console.log(`\nDemo logins:`);
  console.log(`  Admin: admin@learnforge.dev / admin123`);
  console.log(`  Instructor: instructor@learnforge.dev / instructor123`);
  console.log(`  Student: student@learnforge.dev / student123`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
