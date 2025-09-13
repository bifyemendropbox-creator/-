// نظام إدارة المخيمات والمشاريع الطبية
class MedicalCampSystem {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.data = {
            camps: [
                {
                    id: 1,
                    name: "مخيم البصر - صعدة",
                    type: "external",
                    status: "active",
                    location: "صعدة، اليمن",
                    start_date: "2024-12-01",
                    end_date: "2024-12-15",
                    target_beneficiaries: 500,
                    actual_beneficiaries: 347,
                    budget: 50000,
                    spent: 32000
                },
                {
                    id: 2,
                    name: "مشروع مركز الملك سلمان - عدن",
                    type: "internal_salam",
                    status: "planning",
                    location: "عدن، اليمن",
                    start_date: "2024-12-20",
                    end_date: "2025-01-05",
                    target_beneficiaries: 800,
                    actual_beneficiaries: 0,
                    budget: 75000,
                    spent: 0
                }
            ],
            staff: [
                {
                    id: 1,
                    name: "د. أحمد محمد علي",
                    role: "مدير طبي",
                    phone: "+967-123-456-789",
                    email: "ahmed@albasar.org",
                    status: "active"
                },
                {
                    id: 2,
                    name: "فاطمة سعد محمد",
                    role: "مدير مخيم",
                    phone: "+967-123-456-788",
                    email: "fatima@albasar.org",
                    status: "active"
                }
            ],
            services: [
                { type: "كشف طبي", count: 347, icon: "👁️" },
                { type: "عمليات جراحية", count: 45, icon: "🏥" },
                { type: "نظارات طبية", count: 123, icon: "👓" },
                { type: "أدوية", count: 234, icon: "💊" }
            ],
            inventory: [
                {
                    id: 1,
                    name: "أدوية مضادة للالتهاب",
                    quantity: "150 علبة",
                    purchase_date: "2024-10-01",
                    expiry_date: "2025-10-01",
                    status: "متوفر"
                },
                {
                    id: 2,
                    name: "قطرات عين",
                    quantity: "45 زجاجة",
                    purchase_date: "2024-09-15",
                    expiry_date: "2025-03-15",
                    status: "قارب على النفاد"
                }
            ],
            expenses: [
                { category: "نقل", amount: 12000, color: '#1FB8CD' },
                { category: "تغذية", amount: 8000, color: '#FFC185' },
                { category: "سكن", amount: 5000, color: '#B4413C' },
                { category: "معدات", amount: 4000, color: '#ECEBD5' },
                { category: "حوافز", amount: 3000, color: '#5D878F' }
            ]
        };
        
        this.rolePermissions = {
            'camp_manager': ['dashboard', 'camps', 'staff', 'patients', 'finance', 'reports', 'settings'],
            'medical_director': ['dashboard', 'patients', 'staff', 'reports'],
            'store_keeper': ['dashboard', 'inventory', 'reports'],
            'media_officer': ['dashboard', 'media', 'reports'],
            'assistant': ['dashboard', 'patients', 'reports'],
            'coordinator': ['dashboard', 'camps', 'staff', 'reports'],
            'driver': ['dashboard', 'reports'],
            'technical_supervisor': ['dashboard', 'inventory', 'staff', 'reports']
        };

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.showLoginScreen();
            });
        } else {
            this.bindEvents();
            this.showLoginScreen();
        }
    }

    bindEvents() {
        // تسجيل الدخول - make sure form exists
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // تسجيل الخروج
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // التنقل في القائمة الجانبية
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                if (this.hasPermission(view)) {
                    this.showView(view);
                }
            });
        });

        // إغلاق النافذة المنبثقة
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideModal();
            });
        }

        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }

        // أزرار الإجراءات
        this.bindActionButtons();
    }

    bindActionButtons() {
        // أزرار إضافة جديد
        const addButtons = {
            'addCampBtn': () => this.showAddCampModal(),
            'addStaffBtn': () => this.showAddStaffModal(),
            'addPatientBtn': () => this.showAddPatientModal(),
            'addInventoryBtn': () => this.showAddInventoryModal(),
            'addExpenseBtn': () => this.showAddExpenseModal(),
            'generateReportBtn': () => this.showGenerateReportModal(),
            'uploadMediaBtn': () => this.showUploadMediaModal()
        };

        Object.keys(addButtons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', addButtons[buttonId]);
            }
        });

        // نموذج تسجيل المرضى
        const patientForm = document.querySelector('.patient-form');
        if (patientForm) {
            patientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePatientSubmit(e);
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        const role = document.getElementById('userRole')?.value;

        console.log('Login attempt:', { username, password, role }); // Debug log

        if (!username || !password || !role) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        // محاكاة تسجيل دخول ناجح - accept any non-empty values
        this.currentUser = {
            username: username,
            role: role,
            roleArabic: this.getRoleArabic(role)
        };

        console.log('Login successful, user:', this.currentUser); // Debug log
        this.showMainApp();
    }

    handleLogout() {
        this.currentUser = null;
        this.showLoginScreen();
    }

    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
        
        // مسح النماذج
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }

    showMainApp() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        // تحديث معلومات المستخدم
        const currentUserElement = document.getElementById('currentUser');
        if (currentUserElement && this.currentUser) {
            currentUserElement.textContent = 
                `${this.currentUser.roleArabic} - ${this.currentUser.username}`;
        }
        
        // تحديث القائمة الجانبية حسب الصلاحيات
        this.updateSidebarPermissions();
        
        // عرض لوحة التحكم
        this.showView('dashboard');
        
        // تحديث الإحصائيات
        this.updateDashboardStats();
        
        // رسم المخططات - delay to ensure DOM is ready
        setTimeout(() => {
            this.renderCharts();
        }, 100);
    }

    updateSidebarPermissions() {
        if (!this.currentUser) return;
        
        const userPermissions = this.rolePermissions[this.currentUser.role] || [];
        
        document.querySelectorAll('.menu-item').forEach(item => {
            const view = item.getAttribute('data-view');
            const listItem = item.parentElement;
            
            if (userPermissions.includes(view)) {
                listItem.style.display = 'block';
            } else {
                listItem.style.display = 'none';
            }
        });
    }

    hasPermission(view) {
        if (!this.currentUser) return false;
        const userPermissions = this.rolePermissions[this.currentUser.role] || [];
        return userPermissions.includes(view);
    }

    showView(viewName) {
        // إخفاء جميع الصفحات
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // إزالة الكلاسة النشطة من القائمة
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // عرض الصفحة المطلوبة
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
        }

        // تفعيل العنصر في القائمة
        const targetMenuItem = document.querySelector(`[data-view="${viewName}"]`);
        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        }

        // تحديث عنوان الصفحة
        this.updatePageTitle(viewName);
        
        this.currentView = viewName;

        // تنفيذ أي إجراءات خاصة بالصفحة
        this.handleViewSpecificActions(viewName);
    }

    updatePageTitle(viewName) {
        const titles = {
            'dashboard': 'لوحة التحكم الرئيسية',
            'camps': 'إدارة المخيمات',
            'staff': 'إدارة الفريق',
            'patients': 'الخدمات الطبية',
            'inventory': 'إدارة المخازن',
            'finance': 'الإدارة المالية',
            'reports': 'التقارير والتحليلات',
            'media': 'التوثيق الإعلامي',
            'settings': 'الإعدادات'
        };

        const pageTitleElement = document.getElementById('pageTitle');
        if (pageTitleElement) {
            pageTitleElement.textContent = titles[viewName] || 'النظام';
        }
    }

    handleViewSpecificActions(viewName) {
        switch(viewName) {
            case 'dashboard':
                this.updateDashboardStats();
                setTimeout(() => {
                    this.renderPerformanceChart();
                }, 100);
                break;
            case 'finance':
                setTimeout(() => {
                    this.renderExpenseChart();
                }, 100);
                break;
        }
    }

    updateDashboardStats() {
        // تحديث الإحصائيات الرئيسية
        const activeCamps = this.data.camps.filter(camp => camp.status === 'active').length;
        const totalBeneficiaries = this.data.camps.reduce((sum, camp) => sum + camp.actual_beneficiaries, 0);
        const totalBudget = this.data.camps.reduce((sum, camp) => sum + camp.budget, 0);
        
        const activeCampsElement = document.getElementById('activeCamps');
        const totalBeneficiariesElement = document.getElementById('totalBeneficiaries');
        const totalBudgetElement = document.getElementById('totalBudget');
        const performanceScoreElement = document.getElementById('performanceScore');
        
        if (activeCampsElement) activeCampsElement.textContent = activeCamps;
        if (totalBeneficiariesElement) totalBeneficiariesElement.textContent = totalBeneficiaries.toLocaleString();
        if (totalBudgetElement) totalBudgetElement.textContent = totalBudget.toLocaleString();
        if (performanceScoreElement) performanceScoreElement.textContent = '91%';
    }

    renderCharts() {
        this.renderPerformanceChart();
    }

    renderPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx || !window.Chart) return;

        // Destroy existing chart if it exists
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        try {
            ctx.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['تحقيق المستهدفين', 'العمليات المنجزة', 'الرضا العام'],
                    datasets: [{
                        data: [87, 92, 94],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            rtl: true,
                            textDirection: 'rtl'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error rendering performance chart:', error);
        }
    }

    renderExpenseChart() {
        const ctx = document.getElementById('expenseChart');
        if (!ctx || !window.Chart) return;

        // Destroy existing chart if it exists
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        try {
            ctx.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: this.data.expenses.map(expense => expense.category),
                    datasets: [{
                        data: this.data.expenses.map(expense => expense.amount),
                        backgroundColor: this.data.expenses.map(expense => expense.color),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            rtl: true,
                            textDirection: 'rtl'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error rendering expense chart:', error);
        }
    }

    getRoleArabic(role) {
        const roles = {
            'camp_manager': 'مدير مخيم',
            'medical_director': 'مدير طبي',
            'store_keeper': 'أمين مخازن',
            'media_officer': 'إعلامي',
            'assistant': 'مساند',
            'coordinator': 'منظم',
            'driver': 'سائق',
            'technical_supervisor': 'رئيس فنيين'
        };
        return roles[role] || role;
    }

    // النوافذ المنبثقة
    showModal(title, content) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modal = document.getElementById('modal');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modal) modal.classList.remove('hidden');
    }

    hideModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.classList.add('hidden');
    }

    showAddCampModal() {
        const content = `
            <form id="addCampForm">
                <div class="form-group">
                    <label class="form-label">اسم المخيم</label>
                    <input type="text" class="form-control" name="name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">نوع المخيم</label>
                    <select class="form-control" name="type" required>
                        <option value="">اختر النوع</option>
                        <option value="external">خارجي</option>
                        <option value="internal">داخلي</option>
                        <option value="internal_salam">داخلي - مركز السلام</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">الموقع</label>
                    <input type="text" class="form-control" name="location" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">تاريخ البدء</label>
                        <input type="date" class="form-control" name="start_date" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">تاريخ الانتهاء</label>
                        <input type="date" class="form-control" name="end_date" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">المستفيدون المستهدفون</label>
                        <input type="number" class="form-control" name="target_beneficiaries" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الميزانية</label>
                        <input type="number" class="form-control" name="budget" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">وصف المخيم</label>
                    <textarea class="form-control" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">إضافة المخيم</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('إضافة مخيم جديد', content);
        
        // Bind form after modal is shown
        setTimeout(() => {
            const form = document.getElementById('addCampForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddCamp(e);
                });
            }
        }, 100);
    }

    showAddStaffModal() {
        const content = `
            <form id="addStaffForm">
                <div class="form-group">
                    <label class="form-label">الاسم الكامل</label>
                    <input type="text" class="form-control" name="name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">الدور الوظيفي</label>
                    <select class="form-control" name="role" required>
                        <option value="">اختر الدور</option>
                        <option value="مدير مخيم">مدير مخيم</option>
                        <option value="مدير طبي">مدير طبي</option>
                        <option value="أمين مخازن">أمين مخازن</option>
                        <option value="إعلامي">إعلامي</option>
                        <option value="مساند">مساند</option>
                        <option value="منظم">منظم</option>
                        <option value="سائق">سائق</option>
                        <option value="رئيس فنيين">رئيس فنيين</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">رقم الهاتف</label>
                        <input type="tel" class="form-control" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-control" name="email" required>
                    </div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">إضافة عضو الفريق</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('إضافة عضو فريق جديد', content);
        
        setTimeout(() => {
            const form = document.getElementById('addStaffForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddStaff(e);
                });
            }
        }, 100);
    }

    showAddPatientModal() {
        const content = `
            <form id="addPatientForm">
                <div class="form-group">
                    <label class="form-label">اسم المريض</label>
                    <input type="text" class="form-control" name="patient_name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">نوع الخدمة</label>
                    <select class="form-control" name="service_type" required>
                        <option value="">اختر نوع الخدمة</option>
                        <option value="كشف طبي">كشف طبي</option>
                        <option value="عملية جراحية">عملية جراحية</option>
                        <option value="نظارات طبية">نظارات طبية</option>
                        <option value="أدوية">أدوية</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">المخيم</label>
                    <select class="form-control" name="camp_id" required>
                        <option value="">اختر المخيم</option>
                        ${this.data.camps.map(camp => 
                            `<option value="${camp.id}">${camp.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-control" name="notes" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">تسجيل الخدمة</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('تسجيل خدمة طبية جديدة', content);
        
        setTimeout(() => {
            const form = document.getElementById('addPatientForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddPatient(e);
                });
            }
        }, 100);
    }

    showAddInventoryModal() {
        const content = `
            <form id="addInventoryForm">
                <div class="form-group">
                    <label class="form-label">اسم الصنف</label>
                    <input type="text" class="form-control" name="item_name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">الكمية</label>
                        <input type="text" class="form-control" name="quantity" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الوحدة</label>
                        <select class="form-control" name="unit" required>
                            <option value="">اختر الوحدة</option>
                            <option value="علبة">علبة</option>
                            <option value="زجاجة">زجاجة</option>
                            <option value="قطعة">قطعة</option>
                            <option value="كيس">كيس</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">تاريخ الشراء</label>
                        <input type="date" class="form-control" name="purchase_date" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">تاريخ الانتهاء</label>
                        <input type="date" class="form-control" name="expiry_date">
                    </div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">إضافة الصنف</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('إضافة صنف جديد للمخزون', content);
        
        setTimeout(() => {
            const form = document.getElementById('addInventoryForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddInventory(e);
                });
            }
        }, 100);
    }

    showAddExpenseModal() {
        const content = `
            <form id="addExpenseForm">
                <div class="form-group">
                    <label class="form-label">نوع المصروف</label>
                    <select class="form-control" name="expense_type" required>
                        <option value="">اختر نوع المصروف</option>
                        <option value="نقل">نقل</option>
                        <option value="تغذية">تغذية</option>
                        <option value="سكن">سكن</option>
                        <option value="معدات">معدات</option>
                        <option value="حوافز">حوافز</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">المبلغ</label>
                        <input type="number" class="form-control" name="amount" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">المخيم</label>
                        <select class="form-control" name="camp_id" required>
                            <option value="">اختر المخيم</option>
                            ${this.data.camps.map(camp => 
                                `<option value="${camp.id}">${camp.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">تاريخ الصرف</label>
                    <input type="date" class="form-control" name="expense_date" required>
                </div>
                <div class="form-group">
                    <label class="form-label">وصف المصروف</label>
                    <textarea class="form-control" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">إضافة المصروف</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('إضافة مصروف جديد', content);
        
        setTimeout(() => {
            const form = document.getElementById('addExpenseForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddExpense(e);
                });
            }
        }, 100);
    }

    showGenerateReportModal() {
        const content = `
            <form id="generateReportForm">
                <div class="form-group">
                    <label class="form-label">نوع التقرير</label>
                    <select class="form-control" name="report_type" required>
                        <option value="">اختر نوع التقرير</option>
                        <option value="daily">تقرير يومي</option>
                        <option value="financial">تقرير مالي</option>
                        <option value="final">تقرير ختامي</option>
                        <option value="beneficiaries">تقرير المستفيدين</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">المخيم</label>
                    <select class="form-control" name="camp_id" required>
                        <option value="">اختر المخيم</option>
                        ${this.data.camps.map(camp => 
                            `<option value="${camp.id}">${camp.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">من تاريخ</label>
                        <input type="date" class="form-control" name="from_date" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">إلى تاريخ</label>
                        <input type="date" class="form-control" name="to_date" required>
                    </div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">إنشاء التقرير</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('إنشاء تقرير جديد', content);
        
        setTimeout(() => {
            const form = document.getElementById('generateReportForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleGenerateReport(e);
                });
            }
        }, 100);
    }

    showUploadMediaModal() {
        const content = `
            <form id="uploadMediaForm">
                <div class="form-group">
                    <label class="form-label">نوع الملف</label>
                    <select class="form-control" name="media_type" required>
                        <option value="">اختر نوع الملف</option>
                        <option value="image">صورة</option>
                        <option value="video">فيديو</option>
                        <option value="document">مستند</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">عنوان الملف</label>
                    <input type="text" class="form-control" name="title" required>
                </div>
                <div class="form-group">
                    <label class="form-label">المخيم المرتبط</label>
                    <select class="form-control" name="camp_id" required>
                        <option value="">اختر المخيم</option>
                        ${this.data.camps.map(camp => 
                            `<option value="${camp.id}">${camp.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">رفع الملف</label>
                    <input type="file" class="form-control" name="media_file" required>
                </div>
                <div class="form-group">
                    <label class="form-label">وصف الملف</label>
                    <textarea class="form-control" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn--primary">رفع الملف</button>
                    <button type="button" class="btn btn--outline" onclick="medicalCampSystem.hideModal()">إلغاء</button>
                </div>
            </form>
        `;
        
        this.showModal('رفع ملف إعلامي جديد', content);
        
        setTimeout(() => {
            const form = document.getElementById('uploadMediaForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleUploadMedia(e);
                });
            }
        }, 100);
    }

    // معالجات النماذج
    handleAddCamp(e) {
        const formData = new FormData(e.target);
        const campData = Object.fromEntries(formData);
        
        // إضافة المخيم الجديد
        const newCamp = {
            id: this.data.camps.length + 1,
            name: campData.name,
            type: campData.type,
            status: 'planning',
            location: campData.location,
            start_date: campData.start_date,
            end_date: campData.end_date,
            target_beneficiaries: parseInt(campData.target_beneficiaries),
            actual_beneficiaries: 0,
            budget: parseInt(campData.budget),
            spent: 0
        };
        
        this.data.camps.push(newCamp);
        this.hideModal();
        
        alert('تم إضافة المخيم بنجاح');
        
        // تحديث الصفحة إذا كانت صفحة المخيمات مفتوحة
        if (this.currentView === 'camps') {
            this.showView('camps');
        }
    }

    handleAddStaff(e) {
        const formData = new FormData(e.target);
        const staffData = Object.fromEntries(formData);
        
        const newStaff = {
            id: this.data.staff.length + 1,
            name: staffData.name,
            role: staffData.role,
            phone: staffData.phone,
            email: staffData.email,
            status: 'active'
        };
        
        this.data.staff.push(newStaff);
        this.hideModal();
        
        alert('تم إضافة عضو الفريق بنجاح');
    }

    handleAddPatient(e) {
        const formData = new FormData(e.target);
        const patientData = Object.fromEntries(formData);
        
        // تحديث عداد الخدمة المناسب
        const service = this.data.services.find(s => s.type === patientData.service_type);
        if (service) {
            service.count++;
        }
        
        this.hideModal();
        alert('تم تسجيل الخدمة الطبية بنجاح');
        
        // تحديث الإحصائيات
        this.updateDashboardStats();
    }

    handlePatientSubmit(e) {
        // معالجة نموذج المرضى في الصفحة الرئيسية
        const formData = new FormData(e.target);
        alert('تم حفظ الخدمة الطبية بنجاح');
        e.target.reset();
    }

    handleAddInventory(e) {
        const formData = new FormData(e.target);
        const inventoryData = Object.fromEntries(formData);
        
        const newItem = {
            id: this.data.inventory.length + 1,
            name: inventoryData.item_name,
            quantity: `${inventoryData.quantity} ${inventoryData.unit}`,
            purchase_date: inventoryData.purchase_date,
            expiry_date: inventoryData.expiry_date,
            status: 'متوفر'
        };
        
        this.data.inventory.push(newItem);
        this.hideModal();
        
        alert('تم إضافة الصنف للمخزون بنجاح');
    }

    handleAddExpense(e) {
        const formData = new FormData(e.target);
        const expenseData = Object.fromEntries(formData);
        
        // العثور على المخيم وتحديث المصروفات
        const camp = this.data.camps.find(c => c.id == expenseData.camp_id);
        if (camp) {
            camp.spent += parseInt(expenseData.amount);
        }
        
        this.hideModal();
        alert('تم إضافة المصروف بنجاح');
        
        // تحديث الإحصائيات
        this.updateDashboardStats();
    }

    handleGenerateReport(e) {
        const formData = new FormData(e.target);
        const reportData = Object.fromEntries(formData);
        
        this.hideModal();
        
        // محاكاة إنشاء التقرير
        setTimeout(() => {
            alert('تم إنشاء التقرير بنجاح وسيتم تحميله قريباً');
        }, 1000);
    }

    handleUploadMedia(e) {
        const formData = new FormData(e.target);
        const mediaData = Object.fromEntries(formData);
        
        this.hideModal();
        
        // محاكاة رفع الملف
        setTimeout(() => {
            alert('تم رفع الملف بنجاح');
        }, 1000);
    }
}

// تشغيل النظام
let medicalCampSystem;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        medicalCampSystem = new MedicalCampSystem();
    });
} else {
    medicalCampSystem = new MedicalCampSystem();
}