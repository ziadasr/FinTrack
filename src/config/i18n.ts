const translations = {
  en: {
    dir: "ltr" as const,
    locale: "en-US",
    currency: "EGP",
    currencyLocale: "en-EG",
    // Sidebar
    dashboard: "Dashboard",
    transactions: "Transactions",
    accounts: "Accounts",
    categories: "Categories",
    monthlySummary: "Monthly Summary",
    logout: "Logout",
    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Your financial overview at a glance",
    totalBalance: "Total Balance",
    thisMonthIncome: "This Month Income",
    thisMonthExpense: "This Month Expense",
    recentTransactions: "Recent Transactions",
    latestTransactions: "Your latest 10 transactions",
    loadingData: "Loading your data...",
    failedLoad: "Failed to load dashboard data",
    // Accounts
    accountsTitle: "Accounts",
    accountsSubtitle: "Manage your financial accounts",
    addAccount: "Add Account",
    editAccount: "Edit Account",
    newAccount: "New Account",
    accountName: "Account Name",
    accountType: "Account Type",
    initialBalance: "Initial Balance",
    balance: "Balance",
    bank: "Bank",
    cash: "Cash",
    wallet: "Wallet",
    noAccounts: "No accounts yet",
    noAccountsDesc: "Create your first account to start tracking your finances.",
    deleteAccountConfirm: "Are you sure you want to delete this account? This action cannot be undone.",
    // Transactions
    transactionsTitle: "Transactions",
    transactionsSubtitle: "Track your income and expenses",
    addTransaction: "Add Transaction",
    quickAdd: "Quick Add",
    income: "Income",
    expense: "Expense",
    amount: "Amount",
    account: "Account",
    category: "Category",
    note: "Note",
    date: "Date",
    allTypes: "All Types",
    allAccounts: "All Accounts",
    allCategories: "All Categories",
    sortBy: "Sort by",
    newest: "Newest",
    oldest: "Oldest",
    highest: "Highest",
    lowest: "Lowest",
    editTransaction: "Edit Transaction",
    deleteTransaction: "Delete Transaction",
    noTransactions: "No transactions yet",
    noTransactionsDesc: "Start adding transactions to track your finances.",
    noMatchingTransactions: "No matching transactions",
    noMatchingTransactionsDesc: "Try adjusting your filters.",
    deleteTransactionConfirm: "Are you sure you want to delete this transaction?",
    // Categories
    categoriesTitle: "Categories",
    categoriesSubtitle: "Organize your transactions",
    addCategory: "Add Category",
    editCategory: "Edit Category",
    newCategory: "New Category",
    categoryName: "Category Name",
    categoryType: "Type",
    color: "Color",
    customColor: "Custom",
    expenseCategories: "Expense Categories",
    incomeCategories: "Income Categories",
    noCategories: "No categories yet",
    noCategoriesDesc: "Create categories to organize your transactions.",
    deleteCategoryConfirm: "Are you sure you want to delete this category?",
    // Monthly Summary
    monthlySummaryTitle: "Monthly Summary",
    monthlySummarySubtitle: "Analyze your monthly spending patterns",
    netBalance: "Net Balance",
    expenseBreakdown: "Expense Breakdown",
    categoryDetails: "Category Details",
    noData: "No data for this month",
    noDataDesc: "Start adding transactions to see your monthly summary.",
    // Login
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    signInSubtitle: "Sign in to your FinTrack account",
    setupSubtitle: "Set up your username and password to get started",
    username: "Username",
    password: "Password",
    enterUsername: "Enter your username",
    chooseUsername: "Choose a username",
    enterPassword: "Enter your password",
    choosePassword: "Choose a password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    createAccountBtn: "Create account",
    creatingAccount: "Creating account...",
    secured: "Your data stays on your device",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset Password",
    newPassword: "New Password",
    chooseNewPassword: "Choose a new password",
    resetSuccess: "Password reset! Logging you in...",
    resetBtn: "Reset & Sign in",
    resetting: "Resetting...",
    backToLogin: "Back to login",
    // Onboarding
    welcomeTitle: "Welcome to FinTrack!",
    welcomeDesc: "Your personal finance tracker. Let's get you started.",
    onboardStep1Title: "Accounts",
    onboardStep1Desc: "Add your bank accounts, cash, or wallets to track balances across all your money.",
    onboardStep2Title: "Categories",
    onboardStep2Desc: "Categories organize your transactions. We've added common ones for you — Food, Transport, Salary, and more. You can customize them anytime.",
    onboardStep3Title: "Transactions",
    onboardStep3Desc: "Record every income and expense. Your account balances update automatically.",
    onboardGetStarted: "Get Started",
    onboardNext: "Next",
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    loading: "Loading...",
    error: "Error",
    confirm: "Confirm",
    created: "Created",
  },
  ar: {
    dir: "rtl" as const,
    locale: "ar-EG",
    currency: "EGP",
    currencyLocale: "ar-EG",
    // Sidebar
    dashboard: "لوحة التحكم",
    transactions: "المعاملات",
    accounts: "الحسابات",
    categories: "الفئات",
    monthlySummary: "الملخص الشهري",
    logout: "تسجيل الخروج",
    // Dashboard
    dashboardTitle: "لوحة التحكم",
    dashboardSubtitle: "نظرة عامة على وضعك المالي",
    totalBalance: "الرصيد الإجمالي",
    thisMonthIncome: "دخل هذا الشهر",
    thisMonthExpense: "مصروفات هذا الشهر",
    recentTransactions: "أحدث المعاملات",
    latestTransactions: "آخر 10 معاملات",
    loadingData: "جاري تحميل البيانات...",
    failedLoad: "فشل في تحميل البيانات",
    // Accounts
    accountsTitle: "الحسابات",
    accountsSubtitle: "إدارة حساباتك المالية",
    addAccount: "إضافة حساب",
    editAccount: "تعديل الحساب",
    newAccount: "حساب جديد",
    accountName: "اسم الحساب",
    accountType: "نوع الحساب",
    initialBalance: "الرصيد الأولي",
    balance: "الرصيد",
    bank: "بنك",
    cash: "نقدي",
    wallet: "محفظة",
    noAccounts: "لا توجد حسابات بعد",
    noAccountsDesc: "أنشئ حسابك الأول لبدء تتبع أموالك.",
    deleteAccountConfirm: "هل أنت متأكد من حذف هذا الحساب؟ لا يمكن التراجع عن هذا الإجراء.",
    // Transactions
    transactionsTitle: "المعاملات",
    transactionsSubtitle: "تتبع الدخل والمصروفات",
    addTransaction: "إضافة معاملة",
    quickAdd: "إضافة سريعة",
    income: "دخل",
    expense: "مصروف",
    amount: "المبلغ",
    account: "الحساب",
    category: "الفئة",
    note: "ملاحظة",
    date: "التاريخ",
    allTypes: "كل الأنواع",
    allAccounts: "كل الحسابات",
    allCategories: "كل الفئات",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    oldest: "الأقدم",
    highest: "الأعلى",
    lowest: "الأقل",
    editTransaction: "تعديل المعاملة",
    deleteTransaction: "حذف المعاملة",
    noTransactions: "لا توجد معاملات بعد",
    noTransactionsDesc: "ابدأ بإضافة معاملات لتتبع أموالك.",
    noMatchingTransactions: "لا توجد معاملات مطابقة",
    noMatchingTransactionsDesc: "حاول تعديل الفلاتر.",
    deleteTransactionConfirm: "هل أنت متأكد من حذف هذه المعاملة؟",
    // Categories
    categoriesTitle: "الفئات",
    categoriesSubtitle: "تنظيم معاملاتك",
    addCategory: "إضافة فئة",
    editCategory: "تعديل الفئة",
    newCategory: "فئة جديدة",
    categoryName: "اسم الفئة",
    categoryType: "النوع",
    color: "اللون",
    customColor: "مخصص",
    expenseCategories: "فئات المصروفات",
    incomeCategories: "فئات الدخل",
    noCategories: "لا توجد فئات بعد",
    noCategoriesDesc: "أنشئ فئات لتنظيم معاملاتك.",
    deleteCategoryConfirm: "هل أنت متأكد من حذف هذه الفئة؟",
    // Monthly Summary
    monthlySummaryTitle: "الملخص الشهري",
    monthlySummarySubtitle: "تحليل أنماط الإنفاق الشهرية",
    netBalance: "صافي الرصيد",
    expenseBreakdown: "توزيع المصروفات",
    categoryDetails: "تفاصيل الفئات",
    noData: "لا توجد بيانات لهذا الشهر",
    noDataDesc: "ابدأ بإضافة معاملات لرؤية ملخصك الشهري.",
    // Login
    welcomeBack: "مرحباً بعودتك",
    createAccount: "إنشاء حسابك",
    signInSubtitle: "سجّل الدخول إلى حساب FinTrack",
    setupSubtitle: "اختر اسم المستخدم وكلمة المرور للبدء",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    enterUsername: "أدخل اسم المستخدم",
    chooseUsername: "اختر اسم المستخدم",
    enterPassword: "أدخل كلمة المرور",
    choosePassword: "اختر كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    createAccountBtn: "إنشاء الحساب",
    creatingAccount: "جاري إنشاء الحساب...",
    secured: "بياناتك محفوظة على جهازك",
    forgotPassword: "نسيت كلمة المرور؟",
    resetPassword: "إعادة تعيين كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    chooseNewPassword: "اختر كلمة مرور جديدة",
    resetSuccess: "تم إعادة التعيين! جاري تسجيل الدخول...",
    resetBtn: "إعادة تعيين وتسجيل الدخول",
    resetting: "جاري إعادة التعيين...",
    backToLogin: "العودة لتسجيل الدخول",
    // Onboarding
    welcomeTitle: "!مرحباً بك في FinTrack",
    welcomeDesc: "تطبيقك الشخصي لتتبع أموالك. هيا نبدأ.",
    onboardStep1Title: "الحسابات",
    onboardStep1Desc: "أضف حساباتك البنكية أو النقدية أو المحافظ لتتبع أرصدتك في مكان واحد.",
    onboardStep2Title: "الفئات",
    onboardStep2Desc: "الفئات تنظم معاملاتك. أضفنا لك فئات شائعة — طعام، مواصلات، راتب، وغيرها. يمكنك تعديلها في أي وقت.",
    onboardStep3Title: "المعاملات",
    onboardStep3Desc: "سجّل كل دخل ومصروف. أرصدة حساباتك تتحدث تلقائياً.",
    onboardGetStarted: "ابدأ الآن",
    onboardNext: "التالي",
    // Common
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    loading: "جاري التحميل...",
    error: "خطأ",
    confirm: "تأكيد",
    created: "تاريخ الإنشاء",
  },
};

export type Lang = "en" | "ar";
export type TranslationKey = keyof typeof translations.en;

let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "en";

const listeners: Set<() => void> = new Set();

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.dir = translations[lang].dir;
  document.documentElement.lang = lang;
  listeners.forEach((fn) => fn());
}

export function t(key: TranslationKey): string {
  return translations[currentLang][key] || translations.en[key] || key;
}

export function getDir(): "ltr" | "rtl" {
  return translations[currentLang].dir;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(translations[currentLang].currencyLocale, {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(translations[currentLang].locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Initialize direction on load
document.documentElement.dir = translations[currentLang].dir;
document.documentElement.lang = currentLang;
