// 從後端API獲取表單數據
async function fetchFormData() {
    try {
        // 替換為您的Apps Script Web App URL
        const response = await fetch('https://script.google.com/macros/s/YOUR_APPS_SCRIPT_DEPLOYMENT_ID/exec');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('獲取表單數據時出錯:', error);
        // 返回模擬數據作為後備
        return {
            central: {
                name: "中投區會考落點分析",
                formLink: "https://forms.gle/mhV7r7dxmHThhMhV6"
            },
            changhua: {
                name: "彰化區會考落點分析",
                formLink: "https://forms.gle/5nYq6zmPGy1QhVRj9"
            },
            kaohsiung: {
                name: "高雄區會考落點分析",
                formLink: "https://forms.gle/hfSsdXZZvymCnZXD6"
            },
            taoyuan: {
                name: "桃聯區會考落點分析",
                formLink: "https://forms.gle/PRkLgT5Ybdk7pC6e7"
            },
            national: {
                name: "全國會考落點分析",
                formLink: "https://forms.gle/tCMt2a2YUb5Fbx7x6"
            }
        };
    }
}

// 更新表單資訊
async function updateFormInfo() {
    const region = document.getElementById('region').value;
    const formInfo = document.getElementById('formInfo');
    
    if (!region) {
        formInfo.classList.add('hidden');
        return;
    }
    
    // 顯示載入中狀態
    document.getElementById('loadingIndicator').style.display = 'block';
    formInfo.classList.add('hidden');
    
    // 添加視覺效果 - 改變選擇器的邊框顏色
    document.getElementById('region').style.borderColor = 'var(--accent-color)';
    
    // 從後端獲取數據
    const formDatabase = await fetchFormData();
    document.getElementById('loadingIndicator').style.display = 'none';
    
    // 恢復選擇器的邊框顏色
    document.getElementById('region').style.borderColor = '';
    
    if (formDatabase && formDatabase[region]) {
        const regionData = formDatabase[region];
        
        document.getElementById('regionName').textContent = regionData.name;
        document.getElementById('formLink').textContent = regionData.formLink;
        document.getElementById('formLink').href = regionData.formLink;
        
        // Hide first to trigger animation
        formInfo.classList.add('hidden');
        
        // Force reflow
        void formInfo.offsetWidth;
        
        // Show with animation
        setTimeout(() => {
            formInfo.classList.remove('hidden');
        }, 50);
    } else {
        formInfo.classList.add('hidden');
        if (!formDatabase) {
            alert('無法連接到後端服務，請稍後再試。');
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 設置當前年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // 初始隱藏表單資訊區域
    document.getElementById('formInfo').classList.add('hidden');
    
    // 移動選單功能
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.classList.toggle('active');
            
            // Bar animations only 
            if (this.classList.contains('active')) {
                const bars = this.querySelectorAll('.bar');
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                const bars = this.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // 處理移動端導航鏈接點擊事件
    const mobileNavLinks = document.querySelectorAll('.nav-links .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('show');
                navLinks.style.backgroundColor = '';
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    const bars = menuToggle.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    });
    
    // 監聽視窗大小變化
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('show');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        }
    });
    
    // 添加選擇器的懸停動畫效果
    const regionSelector = document.getElementById('region');
    regionSelector.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(67, 97, 238, 0.2)';
    });
    
    regionSelector.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    // 設置模態框功能
    const modal = document.getElementById('instructionsModal');
    const btn = document.getElementById('showInstructions');
    const closeBtn = document.querySelector('.close-button');
    
    btn.addEventListener('click', function() {
        modal.style.display = 'block';
        // 強制重排以啟動動畫
        void modal.offsetWidth;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
        
        // 為步驟添加延遲動畫
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
            }, 100 * (index + 1));
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    // 點擊模態框外部時關閉
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
    
    // 按ESC鍵關閉模態框
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        // 重置步驟動畫狀態
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.style.transition = 'none';
            step.style.opacity = '';
            step.style.transform = '';
        });
        
        setTimeout(function() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // 恢復滾動
        }, 300); // 等待淡出動畫完成
    }
    
    // 深色模式切換功能
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    
    // 檢查本地存儲的主題設置
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    toggleSwitch.addEventListener('change', switchTheme, false);
});