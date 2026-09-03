import { PrismaClient, QuestionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding 10 AI courses + quizzes + discussions + certificates...\n");

  const instrPw = await bcrypt.hash("instructor123", 12);

  const aiInstructors = await Promise.all([
    prisma.user.upsert({ where: { email: "prof.maria@learnforge.dev" }, update: {}, create: { name: "Prof. Maria Chen", email: "prof.maria@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "AI/ML researcher and professor. PhD from Stanford. Specializes in deep learning, computer vision, and natural language processing." } }),
    prisma.user.upsert({ where: { email: "dr.khan.ai@learnforge.dev" }, update: {}, create: { name: "Dr. Zain Khan", email: "dr.khan.ai@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "Principal ML Engineer at DeepMind. Published 50+ papers on reinforcement learning and generative models. PhD from MIT." } }),
    prisma.user.upsert({ where: { email: "prof.lee@learnforge.dev" }, update: {}, create: { name: "Prof. Jenny Lee", email: "prof.lee@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "NLP researcher at Google Brain. Expert in transformers, large language models, and conversational AI. Stanford CS faculty." } }),
    prisma.user.upsert({ where: { email: "dr.patel@learnforge.dev" }, update: {}, create: { name: "Dr. Raj Patel", email: "dr.patel@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "Computer vision expert. Led the autonomous driving team at Tesla. Specializes in object detection, image segmentation, and 3D reconstruction." } }),
    prisma.user.upsert({ where: { email: "prof.santos@learnforge.dev" }, update: {}, create: { name: "Prof. Ana Santos", email: "prof.santos@learnforge.dev", password: instrPw, role: "INSTRUCTOR", isApproved: true, bio: "Robotics and AI researcher at Carnegie Mellon. Expert in reinforcement learning, multi-agent systems, and robot manipulation." } }),
  ]);

  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });

  let aiCat = await prisma.category.findUnique({ where: { slug: "artificial-intelligence" } });
  if (!aiCat) {
    aiCat = await prisma.category.create({ data: { name: "Artificial Intelligence", slug: "artificial-intelligence" } });
  }

  const reviewComments = [
    "This course changed how I think about AI. The explanations are crystal clear and the examples are practical.",
    "Best AI course I have taken. The instructor breaks down complex math into simple terms.",
    "Excellent depth of content. Every lesson builds on the previous one perfectly.",
    "Highly recommended. The quizzes really test your understanding, not just memorization.",
    "Great course for anyone serious about understanding AI from the ground up.",
    "The real-world examples and case studies make this course stand out from others.",
    "Thorough, well-structured, and engaging. I completed it in two weeks.",
    "Perfect balance of theory and practice. The code examples are clean and well-explained.",
    "I have taken many online courses but this one is in a different league. Worth every minute.",
    "Clear, concise, and comprehensive. The instructor clearly knows the subject deeply.",
  ];

  const discussionTopics = [
    { title: "Tips for understanding backpropagation?", content: "I am struggling with the math behind backpropagation. Does anyone have tips or resources that helped them understand the chain rule in the context of neural networks? I understand forward pass but the backward pass confuses me." },
    { title: "Best GPU for training models at home?", content: "I want to start training my own models at home. What GPU would you recommend for a budget of around $500-800? Should I go with NVIDIA RTX 4060 or save up for something bigger?" },
    { title: "How to handle overfitting in practice?", content: "My model performs great on training data but poorly on test data. I have tried dropout and data augmentation. What other techniques have worked for you in real projects?" },
    { title: "Career path in AI/ML - advice needed", content: "I am finishing my CS degree and want to pursue a career in AI/ML. Should I go for a Masters/PhD or can I break into the industry with a strong portfolio and certifications?" },
    { title: "Recommended papers to read for beginners?", content: "I want to start reading research papers but most of them feel overwhelming. Can someone suggest a reading order of foundational papers that are relatively accessible?" },
    { title: "Python vs Julia for ML - which to invest in?", content: "I know Python is the standard for ML but I keep hearing about Julia being faster. For someone starting out, is it worth learning Julia or should I stick with Python?" },
  ];

  const courses = [
    {
      title: "Machine Learning Fundamentals: From Theory to Practice",
      slug: "machine-learning-fundamentals",
      description: "A comprehensive introduction to machine learning covering supervised learning, unsupervised learning, and reinforcement learning. Learn linear regression, logistic regression, decision trees, SVMs, clustering, dimensionality reduction, and neural network basics. Includes hands-on projects with scikit-learn and real-world datasets. No prior ML experience required.",
      instructorIdx: 0,
      price: 0, isFree: true, level: "Beginner",
      modules: [
        { title: "Introduction to Machine Learning", lessons: [
          { title: "What is Machine Learning?", content: "Machine Learning (ML) is a branch of artificial intelligence that enables computers to learn from data without being explicitly programmed. Instead of writing rules manually, we feed data to algorithms that find patterns automatically.\n\nThree types of ML:\n\n1. Supervised Learning: The algorithm learns from labeled data (input-output pairs). Like a teacher showing students examples with answers.\n   - Classification: Predict categories (spam/not spam, cat/dog)\n   - Regression: Predict continuous values (house price, temperature)\n\n2. Unsupervised Learning: The algorithm finds patterns in unlabeled data. No teacher, no correct answers.\n   - Clustering: Group similar items (customer segments)\n   - Dimensionality Reduction: Simplify data while preserving structure\n\n3. Reinforcement Learning: The algorithm learns by trial and error, receiving rewards or penalties.\n   - Game playing (AlphaGo, Atari games)\n   - Robotics (learning to walk, grasp objects)\n\nWhy ML matters today:\n- Healthcare: Disease diagnosis from medical images\n- Finance: Fraud detection, algorithmic trading\n- Transportation: Self-driving cars, route optimization\n- Entertainment: Netflix recommendations, Spotify playlists\n- Language: Google Translate, ChatGPT, voice assistants" },
          { title: "The ML Pipeline: Data to Deployment", content: "Every ML project follows a similar pipeline:\n\n1. Problem Definition\n   - What are you trying to predict or discover?\n   - What data do you have or need?\n   - How will the model be used in production?\n\n2. Data Collection\n   - Databases, APIs, web scraping, surveys\n   - Public datasets: Kaggle, UCI ML Repository\n   - Quality matters more than quantity\n\n3. Data Preprocessing\n   - Handling missing values (imputation, deletion)\n   - Feature encoding (one-hot encoding for categories)\n   - Feature scaling (normalization, standardization)\n   - Train/test split (typically 80/20 or 70/30)\n\n4. Feature Engineering\n   - Creating new features from existing ones\n   - Domain knowledge is crucial here\n   - Example: Extracting hour from timestamp for time-based patterns\n\n5. Model Selection\n   - Choose algorithm based on problem type and data\n   - Start simple (linear models) before trying complex ones\n\n6. Training\n   - Feed training data to the algorithm\n   - Algorithm learns parameters that minimize error\n\n7. Evaluation\n   - Test on held-out data (never seen during training)\n   - Metrics: accuracy, precision, recall, F1, RMSE, MAE\n\n8. Tuning\n   - Hyperparameter optimization (grid search, random search)\n   - Cross-validation for robust estimates\n\n9. Deployment\n   - Serve predictions via API (Flask, FastAPI)\n   - Monitor performance in production\n   - Retrain periodically with new data" },
          { title: "Setting Up Your ML Environment", content: "The standard ML toolkit in Python:\n\nCore libraries:\n- NumPy: Numerical computing, arrays, linear algebra\n- Pandas: Data manipulation, DataFrames, CSV/Excel handling\n- Matplotlib/Seaborn: Data visualization, charts, plots\n- scikit-learn: ML algorithms, preprocessing, evaluation\n\nDeep Learning:\n- TensorFlow: Google's deep learning framework\n- PyTorch: Facebook's deep learning framework (most popular in research)\n- Keras: High-level API for TensorFlow\n\nSetup steps:\n1. Install Python 3.9+ from python.org\n2. Install pip (comes with Python)\n3. Create a virtual environment:\n   python -m venv ml-env\n   source ml-env/bin/activate  (Linux/Mac)\n   ml-env\\Scripts\\activate     (Windows)\n4. Install libraries:\n   pip install numpy pandas matplotlib seaborn scikit-learn jupyter\n5. Launch Jupyter Notebook:\n   jupyter notebook\n\nJupyter Notebook is the standard tool for ML experimentation. It lets you write code, see results, and add notes all in one document. Google Colab is a free cloud alternative with free GPU access." },
        ], quiz: { title: "ML Basics Quiz", passMark: 60, questions: [
          { text: "Which type of ML learns from labeled data?", type: "MCQ", options: [{ text: "Unsupervised Learning", isCorrect: false }, { text: "Supervised Learning", isCorrect: true }, { text: "Reinforcement Learning", isCorrect: false }, { text: "Transfer Learning", isCorrect: false }] },
          { text: "Scikit-learn is a deep learning framework", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: false }, { text: "False", isCorrect: true }] },
          { text: "What is the typical train/test split ratio?", type: "MCQ", options: [{ text: "50/50", isCorrect: false }, { text: "80/20", isCorrect: true }, { text: "95/5", isCorrect: false }, { text: "60/40", isCorrect: false }] },
        ]}},
        { title: "Linear Regression", lessons: [
          { title: "Simple Linear Regression", content: "Linear regression finds the best-fitting straight line through data points. It models the relationship between a dependent variable (y) and an independent variable (x).\n\nThe equation: y = mx + b\n- y: predicted value (dependent variable)\n- x: input feature (independent variable)\n- m: slope (how much y changes when x changes by 1)\n- b: intercept (value of y when x = 0)\n\nHow it works:\n1. Start with random values for m and b\n2. For each data point, calculate the prediction\n3. Measure the error (difference between prediction and actual)\n4. Adjust m and b to reduce the error\n5. Repeat until the error is minimized\n\nCost Function (Mean Squared Error):\nMSE = (1/n) * sum((y_actual - y_predicted)^2)\n\nThe goal is to find m and b that minimize MSE.\n\nGradient Descent:\n- Calculate the gradient (direction of steepest increase in error)\n- Move in the opposite direction (to decrease error)\n- Learning rate controls step size\n- Too large: overshoot. Too small: very slow convergence.\n\nExample use case:\nPredicting house price based on square footage.\nIf m=200 and b=50000, a 1500 sqft house would cost:\ny = 200(1500) + 50000 = $350,000" },
          { title: "Multiple Linear Regression", content: "Multiple linear regression extends simple linear regression to multiple input features.\n\ny = b0 + b1*x1 + b2*x2 + ... + bn*xn\n\nExample: Predicting house price using:\n- x1: square footage\n- x2: number of bedrooms\n- x3: age of the house\n- x4: distance to city center\n\ny = 50000 + 200*sqft + 15000*bedrooms - 1000*age - 5000*distance\n\nAssumptions of linear regression:\n1. Linearity: relationship between x and y is linear\n2. Independence: observations are independent of each other\n3. Homoscedasticity: constant variance of errors\n4. Normality: errors are normally distributed\n5. No multicollinearity: features are not highly correlated with each other\n\nRegularization (preventing overfitting):\n\nRidge Regression (L2):\n- Adds penalty: MSE + lambda * sum(b^2)\n- Shrinks coefficients toward zero but never to exactly zero\n- Good when many features contribute a little\n\nLasso Regression (L1):\n- Adds penalty: MSE + lambda * sum(|b|)\n- Can shrink coefficients to exactly zero (feature selection)\n- Good when only a few features are important\n\nElastic Net:\n- Combines L1 and L2 penalties\n- Best of both worlds" },
          { title: "Polynomial Regression and Feature Engineering", content: "When the relationship between x and y is not linear, we can use polynomial features.\n\nInstead of: y = b0 + b1*x\nWe use: y = b0 + b1*x + b2*x^2 + b3*x^3\n\nThis is still linear regression! The model is linear in its parameters (b0, b1, b2, b3), even though the relationship with x is curved.\n\nIn scikit-learn:\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.pipeline import Pipeline\n\nmodel = Pipeline([\n    ('poly', PolynomialFeatures(degree=3)),\n    ('linear', LinearRegression())\n])\nmodel.fit(X_train, y_train)\n\nBias-Variance Tradeoff:\n- Degree too low (underfitting): High bias, low variance. Model is too simple.\n- Degree too high (overfitting): Low bias, high variance. Model memorizes noise.\n- Sweet spot: Right complexity that generalizes well.\n\nFeature Engineering tips:\n- Log transform for skewed data: log(price)\n- Interaction features: sqft * bedrooms\n- Binning: Convert age to age groups\n- Date features: Extract day, month, year, day of week\n- Text features: Word counts, TF-IDF scores" },
        ], quiz: { title: "Linear Regression Quiz", passMark: 70, questions: [
          { text: "What does MSE stand for?", type: "MCQ", options: [{ text: "Mean Standard Error", isCorrect: false }, { text: "Mean Squared Error", isCorrect: true }, { text: "Maximum Squared Error", isCorrect: false }, { text: "Minimum Standard Error", isCorrect: false }] },
          { text: "Ridge regression uses L1 regularization", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: false }, { text: "False", isCorrect: true }] },
          { text: "What controls step size in gradient descent?", type: "MCQ", options: [{ text: "Batch size", isCorrect: false }, { text: "Epoch count", isCorrect: false }, { text: "Learning rate", isCorrect: true }, { text: "Momentum", isCorrect: false }] },
        ]}},
        { title: "Classification Algorithms", lessons: [
          { title: "Logistic Regression", content: "Despite its name, logistic regression is used for classification, not regression. It predicts the probability that an input belongs to a particular class.\n\nThe sigmoid function:\nsigma(z) = 1 / (1 + e^(-z))\n\nThis function maps any real number to a value between 0 and 1, which we interpret as a probability.\n\nDecision boundary:\n- If probability >= 0.5, predict class 1\n- If probability < 0.5, predict class 0\n\nCost function (Binary Cross-Entropy):\nJ = -(1/n) * sum(y*log(p) + (1-y)*log(1-p))\n\nWhere y is the actual label (0 or 1) and p is the predicted probability.\n\nMulti-class classification:\n- One-vs-Rest (OvR): Train one classifier per class\n- Softmax regression: Generalization for multiple classes\n\nUse cases:\n- Email spam detection\n- Disease diagnosis (positive/negative)\n- Customer churn prediction\n- Credit approval (approve/reject)" },
          { title: "Decision Trees and Random Forests", content: "A decision tree makes predictions by learning a series of if-then rules from data.\n\nHow it works:\n1. Start with all data at the root\n2. Find the best feature and threshold to split on\n3. Create two child nodes based on the split\n4. Repeat recursively until stopping criteria met\n\nSplitting criteria:\n- Gini Impurity: Measures how often a randomly chosen element would be misclassified\n- Information Gain (Entropy): Measures the reduction in uncertainty\n\nAdvantages:\n- Easy to understand and visualize\n- Handles both numerical and categorical data\n- No feature scaling needed\n- Can capture non-linear relationships\n\nDisadvantages:\n- Prone to overfitting (especially deep trees)\n- Unstable (small data changes can create very different trees)\n\nRandom Forest (ensemble method):\n- Trains many decision trees on random subsets of data\n- Each tree uses a random subset of features\n- Final prediction: majority vote (classification) or average (regression)\n- Much more robust than a single tree\n- Reduces overfitting through averaging\n\nHyperparameters to tune:\n- n_estimators: Number of trees (100-500 is common)\n- max_depth: Maximum depth of each tree\n- min_samples_split: Minimum samples to split a node\n- max_features: Features to consider for each split" },
          { title: "Support Vector Machines (SVM)", content: "SVM finds the optimal hyperplane that separates classes with the maximum margin.\n\nKey concepts:\n- Support vectors: The data points closest to the decision boundary\n- Margin: Distance between the hyperplane and the nearest support vectors\n- Goal: Maximize the margin for better generalization\n\nLinear SVM:\n- Works when data is linearly separable\n- Finds a straight line (2D), plane (3D), or hyperplane (nD)\n\nKernel trick:\nWhen data is not linearly separable, we map it to a higher dimension where it becomes separable.\n\nCommon kernels:\n- Linear: K(x,y) = x . y\n- Polynomial: K(x,y) = (x . y + c)^d\n- RBF (Gaussian): K(x,y) = exp(-gamma * ||x-y||^2)\n  Most popular, works well in most cases\n\nC parameter (regularization):\n- Small C: Larger margin, more misclassifications allowed (softer)\n- Large C: Smaller margin, fewer misclassifications (harder)\n\nAdvantages:\n- Effective in high-dimensional spaces\n- Works well with clear margin of separation\n- Memory efficient (uses only support vectors)\n\nDisadvantages:\n- Slow on large datasets\n- Sensitive to feature scaling\n- Does not provide probability estimates directly" },
          { title: "K-Nearest Neighbors (KNN)", content: "KNN is one of the simplest ML algorithms. It classifies a new data point based on the majority class of its k nearest neighbors.\n\nAlgorithm:\n1. Choose the number of neighbors k\n2. Calculate distance from the new point to all training points\n3. Select the k closest points\n4. For classification: majority vote among k neighbors\n5. For regression: average of k neighbors' values\n\nDistance metrics:\n- Euclidean: sqrt(sum((x1-x2)^2))\n- Manhattan: sum(|x1-x2|)\n- Minkowski: Generalization of both\n\nChoosing k:\n- Small k (e.g., 1): More sensitive to noise, complex boundary\n- Large k (e.g., 50): Smoother boundary, may miss local patterns\n- Rule of thumb: k = sqrt(n) where n is number of training samples\n- Use odd k for binary classification to avoid ties\n\nAdvantages:\n- Simple to understand and implement\n- No training phase (lazy learning)\n- Naturally handles multi-class problems\n\nDisadvantages:\n- Slow for large datasets (must compute all distances)\n- Sensitive to irrelevant features\n- Requires feature scaling\n- Curse of dimensionality: Performance degrades in high dimensions\n\nWeighted KNN:\n- Give closer neighbors more influence\n- Weight = 1/distance\n- Reduces the impact of outliers" },
        ], quiz: { title: "Classification Quiz", passMark: 60, questions: [
          { text: "Which algorithm finds the maximum margin hyperplane?", type: "MCQ", options: [{ text: "Decision Tree", isCorrect: false }, { text: "KNN", isCorrect: false }, { text: "SVM", isCorrect: true }, { text: "Logistic Regression", isCorrect: false }] },
          { text: "Random Forest is an ensemble of decision trees", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
          { text: "KNN requires a training phase", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: false }, { text: "False", isCorrect: true }] },
          { text: "Which kernel is most commonly used in SVM?", type: "MCQ", options: [{ text: "Linear", isCorrect: false }, { text: "Polynomial", isCorrect: false }, { text: "RBF (Gaussian)", isCorrect: true }, { text: "Sigmoid", isCorrect: false }] },
        ]}},
        { title: "Unsupervised Learning", lessons: [
          { title: "K-Means Clustering", content: "K-Means groups data into k clusters where each data point belongs to the cluster with the nearest centroid.\n\nAlgorithm:\n1. Choose k (number of clusters)\n2. Randomly initialize k centroids\n3. Assign each point to the nearest centroid\n4. Recalculate centroids as the mean of assigned points\n5. Repeat steps 3-4 until centroids stop moving\n\nChoosing k (Elbow Method):\n1. Run K-Means for k=1, 2, 3, ..., 10\n2. Calculate Within-Cluster Sum of Squares (WCSS) for each\n3. Plot WCSS vs k\n4. Look for the 'elbow' where WCSS drops sharply then levels off\n\nSilhouette Score:\n- Measures how similar a point is to its own cluster vs other clusters\n- Range: -1 to 1 (higher is better)\n- Score > 0.5 indicates reasonable clustering\n\nLimitations:\n- Must specify k in advance\n- Assumes spherical clusters of similar size\n- Sensitive to initialization (use k-means++ for better init)\n- Sensitive to outliers\n\nAlternatives:\n- DBSCAN: Finds clusters of arbitrary shape, handles noise\n- Hierarchical Clustering: Creates a tree of clusters\n- Gaussian Mixture Models: Soft clustering with probabilities" },
          { title: "Dimensionality Reduction with PCA", content: "Principal Component Analysis (PCA) reduces the number of features while preserving as much information as possible.\n\nWhy reduce dimensions?\n- Remove noise and redundant features\n- Speed up training of other algorithms\n- Enable visualization (reduce to 2D or 3D)\n- Combat the curse of dimensionality\n\nHow PCA works:\n1. Standardize the data (mean=0, std=1)\n2. Compute the covariance matrix\n3. Calculate eigenvectors and eigenvalues\n4. Sort eigenvectors by eigenvalue (descending)\n5. Choose top k eigenvectors (principal components)\n6. Project data onto the new k-dimensional space\n\nExplained variance ratio:\n- Shows how much information each component captures\n- Choose enough components to capture 90-95% of variance\n\nExample:\n- 100 features -> PCA -> 10 features (capturing 95% variance)\n- Reduces computation by 10x with minimal information loss\n\nIn scikit-learn:\nfrom sklearn.decomposition import PCA\npca = PCA(n_components=0.95)  # keep 95% variance\nX_reduced = pca.fit_transform(X_scaled)\nprint(f'Reduced from {X.shape[1]} to {X_reduced.shape[1]} features')\n\nt-SNE (alternative for visualization):\n- Better at preserving local structure\n- Great for 2D/3D visualization\n- Not suitable for feature reduction in pipelines" },
        ], quiz: { title: "Unsupervised Learning Quiz", passMark: 60, questions: [
          { text: "K-Means requires specifying the number of clusters in advance", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
          { text: "What does PCA stand for?", type: "MCQ", options: [{ text: "Primary Component Analysis", isCorrect: false }, { text: "Principal Component Analysis", isCorrect: true }, { text: "Partial Cluster Analysis", isCorrect: false }, { text: "Predictive Classification Algorithm", isCorrect: false }] },
        ]}},
        { title: "Model Evaluation and Validation", lessons: [
          { title: "Evaluation Metrics for Classification", content: "Accuracy alone is not enough. Consider a dataset with 95% negative and 5% positive. A model that always predicts negative gets 95% accuracy but is useless.\n\nConfusion Matrix:\n                    Predicted Positive    Predicted Negative\nActual Positive:    True Positive (TP)    False Negative (FN)\nActual Negative:    False Positive (FP)   True Negative (TN)\n\nMetrics:\n\nAccuracy = (TP + TN) / (TP + TN + FP + FN)\n- Overall correctness. Misleading for imbalanced data.\n\nPrecision = TP / (TP + FP)\n- Of all predicted positive, how many are actually positive?\n- Important when false positives are costly (spam filter)\n\nRecall (Sensitivity) = TP / (TP + FN)\n- Of all actual positives, how many did we catch?\n- Important when false negatives are costly (disease detection)\n\nF1 Score = 2 * (Precision * Recall) / (Precision + Recall)\n- Harmonic mean of precision and recall\n- Balances both metrics\n\nROC Curve and AUC:\n- ROC: Plot of True Positive Rate vs False Positive Rate at various thresholds\n- AUC (Area Under Curve): Single number summary (0.5 = random, 1.0 = perfect)\n- AUC > 0.8 is generally considered good" },
          { title: "Cross-Validation and Hyperparameter Tuning", content: "Cross-validation gives a more reliable estimate of model performance than a single train/test split.\n\nK-Fold Cross-Validation:\n1. Split data into k folds (typically k=5 or k=10)\n2. For each fold:\n   a. Use that fold as test set\n   b. Use remaining k-1 folds as training set\n   c. Train and evaluate\n3. Average the k scores\n\nStratified K-Fold:\n- Ensures each fold has the same proportion of classes\n- Essential for imbalanced datasets\n\nHyperparameter Tuning:\n\nGrid Search:\n- Try every combination of specified hyperparameters\n- Thorough but slow\n- param_grid = {'n_estimators': [100, 200, 500], 'max_depth': [5, 10, 20]}\n- 3 x 3 = 9 combinations, each with 5-fold CV = 45 fits\n\nRandom Search:\n- Sample random combinations\n- Faster, often finds good solutions\n- Especially effective with many hyperparameters\n\nBayesian Optimization:\n- Uses past results to decide what to try next\n- Most efficient for expensive models\n- Libraries: Optuna, Hyperopt\n\nIn scikit-learn:\nfrom sklearn.model_selection import GridSearchCV\ngrid = GridSearchCV(estimator, param_grid, cv=5, scoring='f1')\ngrid.fit(X_train, y_train)\nprint(grid.best_params_)\nprint(grid.best_score_)" },
        ], quiz: { title: "Model Evaluation Quiz", passMark: 70, questions: [
          { text: "Which metric is most important when false negatives are costly?", type: "MCQ", options: [{ text: "Precision", isCorrect: false }, { text: "Recall", isCorrect: true }, { text: "Accuracy", isCorrect: false }, { text: "Specificity", isCorrect: false }] },
          { text: "AUC of 0.5 indicates a perfect model", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: false }, { text: "False", isCorrect: true }] },
          { text: "How many total fits does 5-fold CV with 9 hyperparameter combinations produce?", type: "MCQ", options: [{ text: "14", isCorrect: false }, { text: "45", isCorrect: true }, { text: "9", isCorrect: false }, { text: "5", isCorrect: false }] },
        ]}},
        { title: "Ensemble Methods", lessons: [
          { title: "Bagging and Boosting", content: "Ensemble methods combine multiple models to produce better predictions than any single model.\n\nBagging (Bootstrap Aggregating):\n- Train multiple models on random subsets of data (with replacement)\n- Combine predictions: majority vote (classification) or average (regression)\n- Reduces variance (overfitting)\n- Example: Random Forest\n\nBoosting:\n- Train models sequentially, each one fixing errors of the previous\n- Later models focus more on misclassified examples\n- Reduces bias (underfitting)\n- Examples: AdaBoost, Gradient Boosting, XGBoost\n\nGradient Boosting:\n1. Start with a simple prediction (e.g., mean)\n2. Calculate residuals (errors)\n3. Train a tree to predict the residuals\n4. Add the tree's predictions (scaled by learning rate) to the current model\n5. Repeat\n\nXGBoost (Extreme Gradient Boosting):\n- Optimized implementation of gradient boosting\n- Handles missing values automatically\n- Built-in regularization\n- Parallel processing\n- Winner of many Kaggle competitions\n\nLightGBM:\n- Faster than XGBoost for large datasets\n- Uses leaf-wise tree growth (vs level-wise)\n- Lower memory usage\n\nCatBoost:\n- Handles categorical features natively\n- Less hyperparameter tuning needed\n- Good default performance" },
          { title: "Stacking and Model Selection", content: "Stacking (Stacked Generalization):\n- Train multiple diverse models (base learners)\n- Use their predictions as features for a meta-learner\n- The meta-learner learns how to best combine the base predictions\n\nExample:\nBase models: Random Forest, SVM, KNN, Logistic Regression\nMeta-learner: Logistic Regression that takes base predictions as input\n\nModel Selection Guidelines:\n\nSmall dataset (< 1,000 samples):\n- Start with: Logistic Regression, SVM, KNN\n- Avoid: Deep Learning (needs more data)\n\nMedium dataset (1,000 - 100,000 samples):\n- Start with: Random Forest, Gradient Boosting (XGBoost/LightGBM)\n- These often win without much tuning\n\nLarge dataset (> 100,000 samples):\n- Gradient Boosting (XGBoost/LightGBM) for tabular data\n- Deep Learning for images, text, audio\n\nNo Free Lunch Theorem:\n- No single algorithm is best for all problems\n- Always try multiple algorithms and compare\n- Domain knowledge helps narrow the search" },
        ], quiz: { title: "Ensemble Methods Quiz", passMark: 60, questions: [
          { text: "Bagging reduces variance, Boosting reduces bias", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
          { text: "Which library is known for winning many Kaggle competitions?", type: "MCQ", options: [{ text: "scikit-learn", isCorrect: false }, { text: "XGBoost", isCorrect: true }, { text: "TensorFlow", isCorrect: false }, { text: "Pandas", isCorrect: false }] },
        ]}},
        { title: "Feature Engineering and Data Preprocessing", lessons: [
          { title: "Handling Missing Data and Outliers", content: "Real-world data is messy. Missing values and outliers can significantly impact model performance.\n\nHandling Missing Values:\n\n1. Deletion:\n   - Drop rows with missing values (if few)\n   - Drop columns with too many missing values (>50%)\n   - Risk: losing valuable data\n\n2. Imputation:\n   - Mean/Median: Replace with column average (numerical)\n   - Mode: Replace with most frequent value (categorical)\n   - Forward/Backward fill: Use previous/next value (time series)\n   - KNN Imputation: Use K nearest neighbors to estimate\n   - MICE: Multiple Imputation by Chained Equations\n\n3. Indicator variable:\n   - Add a binary column: is_missing_feature = 1/0\n   - Sometimes missingness itself is informative\n\nHandling Outliers:\n\n1. Detection:\n   - Z-score: Points with |z| > 3 are outliers\n   - IQR method: Points below Q1 - 1.5*IQR or above Q3 + 1.5*IQR\n   - Visualization: Box plots, scatter plots\n\n2. Treatment:\n   - Remove: If clearly erroneous (typos, sensor errors)\n   - Cap/Floor: Replace with boundary values (winsorization)\n   - Transform: Log transform to reduce impact\n   - Keep: If they represent real extreme cases\n   - Use robust algorithms: Tree-based models handle outliers well" },
          { title: "Feature Scaling and Encoding", content: "Many ML algorithms are sensitive to the scale of features. A feature ranging from 0-1000 can dominate one ranging from 0-1.\n\nScaling methods:\n\nStandardization (Z-score normalization):\n- x_scaled = (x - mean) / std\n- Results in mean=0, std=1\n- Use when: Data is normally distributed, for SVM, Linear Regression, KNN\n\nMin-Max Normalization:\n- x_scaled = (x - min) / (max - min)\n- Results in values between 0 and 1\n- Use when: You need bounded values, for Neural Networks\n\nRobust Scaling:\n- x_scaled = (x - median) / IQR\n- Less affected by outliers\n- Use when: Data has outliers\n\nEncoding Categorical Variables:\n\nLabel Encoding:\n- Maps categories to integers: Red=0, Blue=1, Green=2\n- Use for: Ordinal data (Low, Medium, High)\n- Problem: Implies ordering that may not exist\n\nOne-Hot Encoding:\n- Creates binary columns for each category\n- Red=[1,0,0], Blue=[0,1,0], Green=[0,0,1]\n- Use for: Nominal data (no inherent order)\n- Warning: Can create many columns (high cardinality)\n\nTarget Encoding:\n- Replace category with mean of target variable\n- Use for: High cardinality categorical features\n- Risk: Data leakage if not done carefully" },
        ], quiz: { title: "Data Preprocessing Quiz", passMark: 60, questions: [
          { text: "Which scaling method is least affected by outliers?", type: "MCQ", options: [{ text: "Min-Max", isCorrect: false }, { text: "Standardization", isCorrect: false }, { text: "Robust Scaling", isCorrect: true }, { text: "None of the above", isCorrect: false }] },
          { text: "One-hot encoding is best for ordinal data", type: "TRUE_FALSE", options: [{ text: "True", isCorrect: false }, { text: "False", isCorrect: true }] },
        ]}},
      ],
    },
  ];

  // Additional shorter AI courses
  const shortCourses = [
    { title: "Deep Learning with PyTorch", slug: "deep-learning-pytorch", description: "Master deep learning using PyTorch, the most popular framework in AI research. Cover CNNs, RNNs, transformers, GANs, and deploy models to production. Build 10+ projects including image classifiers, text generators, and style transfer.", instructorIdx: 1, price: 29.99, isFree: false, level: "Advanced", modCount: 8 },
    { title: "Natural Language Processing Complete Guide", slug: "nlp-complete-guide", description: "Learn to build systems that understand human language. Cover text preprocessing, word embeddings, sequence models, attention mechanisms, transformers, BERT, GPT, and build chatbots, sentiment analyzers, and translation systems.", instructorIdx: 2, price: 24.99, isFree: false, level: "Advanced", modCount: 9 },
    { title: "Computer Vision: From Basics to Advanced", slug: "computer-vision-basics-advanced", description: "Master computer vision with deep learning. Cover image classification, object detection (YOLO, SSD), semantic segmentation, face recognition, pose estimation, and video analysis. Hands-on with OpenCV, TensorFlow, and PyTorch.", instructorIdx: 3, price: 19.99, isFree: false, level: "Intermediate", modCount: 8 },
    { title: "Reinforcement Learning Masterclass", slug: "reinforcement-learning-masterclass", description: "Learn how AI agents learn from interaction. Cover Markov Decision Processes, Q-learning, Deep Q-Networks, Policy Gradients, Actor-Critic methods, and multi-agent RL. Build game-playing agents and robotic controllers.", instructorIdx: 4, price: 34.99, isFree: false, level: "Advanced", modCount: 7 },
    { title: "Generative AI and Large Language Models", slug: "generative-ai-llms", description: "Understand how ChatGPT, DALL-E, and Stable Diffusion work. Cover transformer architecture, attention mechanisms, pretraining, fine-tuning, prompt engineering, RAG, and building AI-powered applications.", instructorIdx: 1, price: 0, isFree: true, level: "Intermediate", modCount: 8 },
    { title: "MLOps: Deploying ML Models to Production", slug: "mlops-production", description: "Bridge the gap between ML experiments and production systems. Cover model serving, monitoring, CI/CD for ML, feature stores, experiment tracking with MLflow, containerization, and Kubernetes deployment.", instructorIdx: 0, price: 19.99, isFree: false, level: "Advanced", modCount: 7 },
    { title: "Mathematics for Machine Learning", slug: "math-for-ml", description: "Build the mathematical foundation for understanding ML algorithms. Cover linear algebra, calculus, probability, statistics, and optimization. Every concept is connected to its ML application with Python examples.", instructorIdx: 0, price: 0, isFree: true, level: "Beginner", modCount: 8 },
    { title: "Time Series Analysis and Forecasting with AI", slug: "time-series-forecasting-ai", description: "Learn to predict future values from historical data. Cover ARIMA, Prophet, LSTM networks, transformer models for time series, anomaly detection, and real-world applications in finance, weather, and demand forecasting.", instructorIdx: 2, price: 14.99, isFree: false, level: "Intermediate", modCount: 7 },
    { title: "AI Ethics, Safety, and Responsible AI", slug: "ai-ethics-safety", description: "Explore the ethical challenges of AI systems. Cover bias and fairness, explainability, privacy, alignment, AI regulation, deepfakes, autonomous weapons, and building responsible AI systems. Case studies from real-world AI failures.", instructorIdx: 4, price: 0, isFree: true, level: "Beginner", modCount: 7 },
  ];

  const moduleTemplates: Record<string, string[]> = {
    "deep-learning-pytorch": ["Introduction to Deep Learning", "PyTorch Fundamentals and Tensors", "Building Neural Networks from Scratch", "Convolutional Neural Networks (CNNs)", "Recurrent Neural Networks and LSTMs", "Transfer Learning and Fine-Tuning", "Generative Adversarial Networks (GANs)", "Model Deployment and Optimization"],
    "nlp-complete-guide": ["Text Preprocessing and Tokenization", "Word Embeddings: Word2Vec and GloVe", "Text Classification with ML", "Sequence Models: RNNs and LSTMs", "Attention Mechanisms", "Transformers Architecture Deep Dive", "BERT and Pre-trained Language Models", "Building Chatbots and QA Systems", "Advanced NLP: Summarization and Translation"],
    "computer-vision-basics-advanced": ["Image Processing Fundamentals", "Introduction to OpenCV", "CNNs for Image Classification", "Object Detection: YOLO and SSD", "Image Segmentation", "Face Detection and Recognition", "Pose Estimation and Action Recognition", "Video Analysis and Tracking"],
    "reinforcement-learning-masterclass": ["Introduction to Reinforcement Learning", "Markov Decision Processes", "Dynamic Programming Methods", "Monte Carlo Methods", "Q-Learning and SARSA", "Deep Q-Networks (DQN)", "Policy Gradient Methods"],
    "generative-ai-llms": ["Introduction to Generative AI", "Transformer Architecture Explained", "Pre-training and Fine-tuning", "Prompt Engineering Techniques", "Retrieval Augmented Generation (RAG)", "Building with OpenAI and Claude APIs", "Image Generation: DALL-E and Stable Diffusion", "Building AI-Powered Applications"],
    "mlops-production": ["Introduction to MLOps", "Experiment Tracking with MLflow", "Data and Feature Pipelines", "Model Serving with FastAPI", "Docker for ML Engineers", "CI/CD for Machine Learning", "Monitoring and Observability"],
    "math-for-ml": ["Linear Algebra Foundations", "Vectors, Matrices, and Transformations", "Calculus for Optimization", "Probability Fundamentals", "Statistical Inference", "Probability Distributions", "Optimization Algorithms", "Information Theory Basics"],
    "time-series-forecasting-ai": ["Introduction to Time Series Data", "Statistical Methods: ARIMA and SARIMA", "Facebook Prophet for Forecasting", "Feature Engineering for Time Series", "LSTM Networks for Sequences", "Transformer Models for Time Series", "Anomaly Detection in Time Series"],
    "ai-ethics-safety": ["Introduction to AI Ethics", "Bias and Fairness in ML", "Explainable AI (XAI)", "Privacy and Data Protection", "AI Safety and Alignment", "Deepfakes and Misinformation", "AI Regulation and Governance"],
  };

  const lessonContent = "This lesson provides a comprehensive overview of the topic with real-world examples and practical applications.\n\nKey concepts covered:\n\n1. Theoretical Foundation\nWe begin by understanding the core principles and mathematical foundations that underpin this topic. Every concept is explained with intuitive examples before diving into the formal definitions.\n\n2. Practical Implementation\nAfter understanding the theory, we implement the concepts in Python with clean, well-documented code. Each implementation includes error handling, edge cases, and best practices used in production systems.\n\n3. Real-World Applications\nWe explore how these concepts are used in industry. From recommendation systems at Netflix to autonomous driving at Tesla, we connect classroom knowledge to practical applications.\n\n4. Common Pitfalls\nWe discuss the most common mistakes practitioners make and how to avoid them. Understanding what can go wrong is as important as understanding what should go right.\n\n5. Hands-On Exercise\nAt the end of this lesson, you will complete a hands-on exercise that reinforces the concepts covered. The exercise uses a real-world dataset and requires you to apply everything you have learned.\n\nAdditional Resources:\n- Research papers referenced in this lesson\n- Recommended books for deeper understanding\n- Open-source implementations to study\n- Community forums for discussion and questions";

  // Create the big ML course
  for (const cd of courses) {
    const existing = await prisma.course.findUnique({ where: { slug: cd.slug } });
    if (existing) { console.log(`  Skipping "${cd.title}" (exists)`); continue; }

    const course = await prisma.course.create({
      data: { title: cd.title, slug: cd.slug, description: cd.description, price: cd.price, isFree: cd.isFree, level: cd.level, status: "PUBLISHED", instructorId: aiInstructors[cd.instructorIdx].id, categoryId: aiCat.id },
    });

    for (let mi = 0; mi < cd.modules.length; mi++) {
      const md = cd.modules[mi];
      const mod = await prisma.module.create({ data: { title: md.title, position: mi, courseId: course.id } });
      for (let li = 0; li < md.lessons.length; li++) {
        await prisma.lesson.create({ data: { title: md.lessons[li].title, content: md.lessons[li].content, position: li, isFree: li === 0, moduleId: mod.id } });
      }
      if (md.quiz) {
        await prisma.quiz.create({ data: { title: md.quiz.title, passMark: md.quiz.passMark, moduleId: mod.id, questions: { create: md.quiz.questions.map((q, qi) => ({ text: q.text, type: q.type as QuestionType, points: 1, position: qi, options: { create: q.options } })) } } });
      }
    }

    // Add enrollments, reviews, discussions
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(6, shuffled.length); i++) {
      const progress = Math.floor(Math.random() * 101);
      try {
        const enrollment = await prisma.enrollment.create({ data: { userId: shuffled[i].id, courseId: course.id, progress, status: progress === 100 ? "COMPLETED" : "ACTIVE", completedAt: progress === 100 ? new Date() : null } });
        if (progress === 100) {
          await prisma.certificate.create({ data: { userId: shuffled[i].id, courseId: course.id } }).catch(() => {});
        }
        if (Math.random() > 0.3) {
          await prisma.review.create({ data: { userId: shuffled[i].id, courseId: course.id, rating: Math.floor(Math.random() * 2) + 4, comment: reviewComments[Math.floor(Math.random() * reviewComments.length)] } }).catch(() => {});
        }
      } catch {}
    }

    const disc = discussionTopics[Math.floor(Math.random() * discussionTopics.length)];
    if (shuffled[0]) {
      const d = await prisma.discussion.create({ data: { title: disc.title, content: disc.content, userId: shuffled[0].id, courseId: course.id } });
      if (shuffled[1]) {
        await prisma.reply.create({ data: { content: "Great question! I had the same issue. What helped me was watching 3Blue1Brown's videos on YouTube. They visualize the concepts beautifully.", userId: shuffled[1].id, discussionId: d.id } });
      }
      await prisma.reply.create({ data: { content: "I recommend starting with the basics and building up gradually. The course materials here cover it well, but extra practice helps a lot.", userId: aiInstructors[cd.instructorIdx].id, discussionId: d.id } });
    }

    console.log(`  Created: ${cd.title} (${cd.modules.length} modules)`);
  }

  // Create shorter courses with generated content
  for (const sc of shortCourses) {
    const existing = await prisma.course.findUnique({ where: { slug: sc.slug } });
    if (existing) { console.log(`  Skipping "${sc.title}" (exists)`); continue; }

    const course = await prisma.course.create({
      data: { title: sc.title, slug: sc.slug, description: sc.description, price: sc.price, isFree: sc.isFree, level: sc.level, status: "PUBLISHED", instructorId: aiInstructors[sc.instructorIdx].id, categoryId: aiCat.id },
    });

    const modNames = moduleTemplates[sc.slug] || [];
    for (let mi = 0; mi < modNames.length; mi++) {
      const mod = await prisma.module.create({ data: { title: modNames[mi], position: mi, courseId: course.id } });

      const lessonTitles = [
        `Introduction to ${modNames[mi]}`,
        `Core Concepts and Theory`,
        `Hands-On Implementation`,
        `Advanced Techniques and Best Practices`,
      ];

      for (let li = 0; li < lessonTitles.length; li++) {
        await prisma.lesson.create({ data: { title: lessonTitles[li], content: `${modNames[mi]}\n\n${lessonContent}`, position: li, isFree: mi === 0 && li === 0, moduleId: mod.id } });
      }

      // Quiz for every other module
      if (mi % 2 === 0) {
        await prisma.quiz.create({ data: { title: `${modNames[mi]} Quiz`, passMark: 65, moduleId: mod.id, questions: { create: [
          { text: `What is the primary purpose of ${modNames[mi].toLowerCase()}?`, type: "MCQ", points: 1, position: 0, options: { create: [{ text: "Data storage", isCorrect: false }, { text: "Pattern recognition and learning", isCorrect: true }, { text: "File management", isCorrect: false }, { text: "Network routing", isCorrect: false }] } },
          { text: `${modNames[mi]} is an important topic in modern AI`, type: "TRUE_FALSE", points: 1, position: 1, options: { create: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] } },
          { text: "Which programming language is most commonly used for this topic?", type: "MCQ", points: 1, position: 2, options: { create: [{ text: "Java", isCorrect: false }, { text: "C#", isCorrect: false }, { text: "Python", isCorrect: true }, { text: "Ruby", isCorrect: false }] } },
        ] } } });
      }
    }

    // Enrollments, reviews, discussions, certificates
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(5 + Math.floor(Math.random() * 3), shuffled.length); i++) {
      const progress = Math.floor(Math.random() * 101);
      try {
        await prisma.enrollment.create({ data: { userId: shuffled[i].id, courseId: course.id, progress, status: progress === 100 ? "COMPLETED" : "ACTIVE", completedAt: progress === 100 ? new Date() : null } });
        if (progress === 100) { await prisma.certificate.create({ data: { userId: shuffled[i].id, courseId: course.id } }).catch(() => {}); }
        if (Math.random() > 0.35) { await prisma.review.create({ data: { userId: shuffled[i].id, courseId: course.id, rating: Math.floor(Math.random() * 2) + 4, comment: reviewComments[Math.floor(Math.random() * reviewComments.length)] } }).catch(() => {}); }
      } catch {}
    }

    const disc = discussionTopics[Math.floor(Math.random() * discussionTopics.length)];
    if (shuffled[0]) {
      const d = await prisma.discussion.create({ data: { title: disc.title, content: disc.content, userId: shuffled[0].id, courseId: course.id } });
      if (shuffled[1]) { await prisma.reply.create({ data: { content: "Thanks for bringing this up. I found the course materials very helpful for understanding this.", userId: shuffled[1].id, discussionId: d.id } }); }
      await prisma.reply.create({ data: { content: "Happy to help! Feel free to ask more questions. The discussion forum is here for exactly this kind of learning.", userId: aiInstructors[sc.instructorIdx].id, discussionId: d.id } });
    }

    console.log(`  Created: ${sc.title} (${modNames.length} modules, ${modNames.length * 4} lessons)`);
  }

  // Add discussions and certificates to existing courses that don't have them
  const allCourses = await prisma.course.findMany({ where: { status: "PUBLISHED" }, select: { id: true, title: true, instructorId: true } });

  for (const course of allCourses) {
    const discCount = await prisma.discussion.count({ where: { courseId: course.id } });
    if (discCount === 0 && students.length > 0) {
      const disc = discussionTopics[Math.floor(Math.random() * discussionTopics.length)];
      const d = await prisma.discussion.create({ data: { title: disc.title, content: disc.content, userId: students[0].id, courseId: course.id } });
      if (students[1]) { await prisma.reply.create({ data: { content: "I had this same question. The course content explains it well in the later modules.", userId: students[1].id, discussionId: d.id } }); }
      await prisma.reply.create({ data: { content: "Great question! Let me know if you need more clarification after going through the relevant lessons.", userId: course.instructorId, discussionId: d.id } });
    }

    // Generate certificates for completed enrollments
    const completedEnrollments = await prisma.enrollment.findMany({ where: { courseId: course.id, status: "COMPLETED" } });
    for (const enrollment of completedEnrollments) {
      await prisma.certificate.create({ data: { userId: enrollment.userId, courseId: course.id } }).catch(() => {});
    }
  }

  // Final counts
  const totalCourses = await prisma.course.count({ where: { status: "PUBLISHED" } });
  const totalModules = await prisma.module.count();
  const totalLessons = await prisma.lesson.count();
  const totalQuizzes = await prisma.quiz.count();
  const totalEnrollments = await prisma.enrollment.count();
  const totalReviews = await prisma.review.count();
  const totalDiscussions = await prisma.discussion.count();
  const totalCertificates = await prisma.certificate.count();

  console.log(`\nSeed complete!`);
  console.log(`  Published Courses: ${totalCourses}`);
  console.log(`  Modules: ${totalModules}`);
  console.log(`  Lessons: ${totalLessons}`);
  console.log(`  Quizzes: ${totalQuizzes}`);
  console.log(`  Enrollments: ${totalEnrollments}`);
  console.log(`  Reviews: ${totalReviews}`);
  console.log(`  Discussions: ${totalDiscussions}`);
  console.log(`  Certificates: ${totalCertificates}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
