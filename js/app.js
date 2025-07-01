/**
 * InnoLab V10 - 主应用逻辑
 * 处理页面交互、用户数据、模块导航等
 */

class InnoLabApp {
    constructor() {
        this.userData = this.loadUserData();
        this.init();
    }

    init() {
        this.updateUserInterface();
        this.bindEvents();
        this.startAnimations();
    }

    // 加载用户数据
    loadUserData() {
        const defaultData = {
            level: 1,
            points: 0,
            completedCases: 0,
            trainingCount: 0,
            innovations: 0,
            streak: 0
        };

        const savedData = localStorage.getItem('innolab_user_data');
        return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
    }

    // 保存用户数据
    saveUserData() {
        localStorage.setItem('innolab_user_data', JSON.stringify(this.userData));
    }

    // 更新用户界面
    updateUserInterface() {
        // 更新等级显示
        const levelBadge = document.getElementById('userLevel');
        if (levelBadge) {
            levelBadge.textContent = `Lv.${this.userData.level} ${this.getLevelTitle()}`;
        }

        // 更新积分显示
        const pointsDisplay = document.getElementById('userPoints');
        if (pointsDisplay) {
            pointsDisplay.textContent = `${this.userData.points} 积分`;
        }

        // 更新统计数据
        this.updateStats();
    }

    // 获取等级称号
    getLevelTitle() {
        const titles = {
            1: '探索者',
            2: '思考者',
            3: '突破者',
            4: '创新者',
            5: '大师'
        };
        return titles[Math.min(this.userData.level, 5)] || '传奇';
    }

    // 更新统计数据
    updateStats() {
        const stats = [
            { id: 'totalUsers', value: '2,500+', label: '活跃用户' },
            { id: 'totalCases', value: this.userData.completedCases.toString(), label: '案例完成' },
            { id: 'totalTraining', value: this.userData.trainingCount.toString(), label: '训练次数' },
            { id: 'innovations', value: this.userData.innovations.toString(), label: '创新突破' }
        ];

        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (element) {
                const numberEl = element.querySelector('.stat-number');
                const labelEl = element.querySelector('.stat-label');
                if (numberEl) numberEl.textContent = stat.value;
                if (labelEl) labelEl.textContent = stat.label;
            }
        });
    }

    // 绑定事件
    bindEvents() {
        // 模块按钮点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('module-btn')) {
                const action = e.target.dataset.action;
                this.handleModuleAction(action);
            }

            // CTA按钮点击
            if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
                const href = e.target.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            }
        });

        // 训练模式选择
        document.querySelectorAll('.mode-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectTrainingMode(item.dataset.mode);
            });
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // ESC键返回主页
                this.showHomePage();
            }
        });
    }

    // 处理模块操作
    handleModuleAction(action) {
        switch (action) {
            case 'case_library':
                this.openCaseLibrary();
                break;
            case 'training':
                this.openTraining();
                break;
            case 'innovation':
                this.openInnovation();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    // 打开案例学习库
    openCaseLibrary() {
        // 这里将跳转到案例库页面
        window.location.href = 'learning-realm.html';
    }

    // 打开反共识训练
    openTraining() {
        // 这里将跳转到训练页面
        window.location.href = 'training-v10.html';
    }

    // 打开破界创新引擎
    openInnovation() {
        // 这里将跳转到创新页面
        window.location.href = 'innovation-realm.html';
    }

    // 选择训练模式
    selectTrainingMode(mode) {
        // 移除其他选中状态
        document.querySelectorAll('.mode-item').forEach(item => {
            item.classList.remove('selected');
        });

        // 添加选中状态
        const selectedItem = document.querySelector(`[data-mode="${mode}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        // 更新训练按钮
        const trainingBtn = document.querySelector('[data-action="training"]');
        if (trainingBtn) {
            trainingBtn.textContent = `开始${this.getModeLabel(mode)}训练`;
        }
    }

    // 获取模式标签
    getModeLabel(mode) {
        const labels = {
            'dialogue': '对话模式',
            'challenge': '挑战模式',
            'scenario': '情景模式'
        };
        return labels[mode] || '';
    }

    // 启动动画效果
    startAnimations() {
        // 数字递增动画
        this.animateNumbers();
        
        // 卡片出现动画
        this.animateCards();
        
        // 粒子背景效果
        this.createParticles();
    }

    // 数字递增动画
    animateNumbers() {
        document.querySelectorAll('.stat-number').forEach(element => {
            const finalValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
            if (finalValue > 0) {
                this.animateValue(element, 0, finalValue, 2000);
            }
        });
    }

    // 数值动画函数
    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            // 格式化显示
            if (end > 1000) {
                element.textContent = (value / 1000).toFixed(1) + 'K+';
            } else {
                element.textContent = value.toString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 卡片动画
    animateCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.module-card, .stat-card, .feature-item').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // 创建粒子效果
    createParticles() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.3';
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        
        // 创建粒子
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // 更新位置
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // 边界检查
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // 绘制粒子
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // 窗口大小改变时调整画布
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // 显示主页
    showHomePage() {
        window.location.href = 'index.html';
    }

    // 添加经验值
    addExperience(points) {
        this.userData.points += points;
        this.checkLevelUp();
        this.saveUserData();
        this.updateUserInterface();
    }

    // 检查升级
    checkLevelUp() {
        const requiredPoints = this.userData.level * 1000;
        if (this.userData.points >= requiredPoints) {
            this.userData.level++;
            this.userData.points -= requiredPoints;
            this.showLevelUpNotification();
        }
    }

    // 显示升级通知
    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>🎉 恭喜升级！</h3>
                <p>您已达到 Lv.${this.userData.level} ${this.getLevelTitle()}</p>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            text-align: center;
            animation: levelUpIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'levelUpOut 0.5s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// 初始化应用
const app = new InnoLabApp();

// 新增的模态框和功能函数
window.showFreeExperience = function() {
    showModal('freeExperienceModal');
};

window.showPaidFeatures = function() {
    showModal('paidFeaturesModal');
};

window.startFreeExperience = function(type) {
    closeModal('freeExperienceModal');
    
    // 根据类型跳转到对应页面
    if (type === 'case-library') {
        // 跳转到案例学习页面
        window.location.href = 'case-library.html';
    } else if (type === 'training') {
        // 跳转到反共识训练页面
        window.location.href = 'training.html';
    }
    
    // 记录用户选择的免费体验类型
    localStorage.setItem('free_experience_type', type);
    app.addExperience(10); // 给予体验积分
};

window.showComingSoon = function() {
    closeModal('paidFeaturesModal');
    showModal('comingSoonModal');
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
};

// 显示模态框的通用函数
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // 使用 setTimeout 确保 CSS 动画正常工作
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 关闭所有打开的模态框
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有特定的URL参数来直接打开某个模态框
    const urlParams = new URLSearchParams(window.location.search);
    const modal = urlParams.get('modal');
    
    if (modal === 'free') {
        showFreeExperience();
    } else if (modal === 'paid') {
        showPaidFeatures();
    }
    
    // 如果用户之前有免费体验记录，显示欢迎回来提示
    const freeExperienceType = localStorage.getItem('free_experience_type');
    if (freeExperienceType) {
        console.log(`欢迎回来！您上次体验了${freeExperienceType === 'case-library' ? '案例学习' : '反共识训练'}模式`);
    }
});

// 导出到全局
window.InnoLabApp = InnoLabApp; 