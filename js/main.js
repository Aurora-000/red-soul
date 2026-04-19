/**
 * 北疆红韵 - 核心交互脚本 (极致精细重构版)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 移动端菜单切换逻辑
    const createMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        const menuBtn = document.createElement('div');
        menuBtn.className = 'menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = 'display: none; font-size: 1.5rem; cursor: pointer;';
        
        // 只有在小屏幕显示
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        }
        
        navContainer.appendChild(menuBtn);
        
        const navLinks = document.querySelector('.nav-links');
        menuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--primary-red)';
            navLinks.style.padding = '20px';
        });
    };
    createMobileMenu();

    // 2. 返回顶部功能
    const backToTop = document.createElement('div');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. 视频直放功能增强 (点击缩略图直接加载iframe/video)
    const setupVideoPlayers = () => {
        const videoThumbs = document.querySelectorAll('.video-thumb');
        videoThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const parent = this.parentElement;
                const videoUrl = this.getAttribute('data-video-url');
                const title = this.getAttribute('data-title');
                
                if (videoUrl) {
                    // 创建 iframe 容器并替换缩略图
                    const container = document.createElement('div');
                    container.className = 'video-iframe-container';
                    container.style.cssText = 'position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;';
                    container.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>`;
                    
                    // 替换缩略图
                    this.replaceWith(container);
                    console.log(`正在播放：${title} - 资源来源于官方开放接口`);
                }
            });
        });
    };
    setupVideoPlayers();

    // 4. 内容分类筛选器 (用于资源页)
    const filterTabs = document.querySelectorAll('.filter-btn');
    filterTabs.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 切换按钮激活状态
            filterTabs.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 执行筛选
            const items = document.querySelectorAll('.filter-item-card');
            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'navFade 0.4s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 5. 模拟资源下载
    document.addEventListener('click', (e) => {
        const downloadBtn = e.target.closest('.resource-download');
        if (downloadBtn) {
            e.preventDefault();
            const fileName = downloadBtn.getAttribute('data-file') || '资源文件';
            alert(`【北疆红韵】\n正在从云端服务器调取资源：${fileName}\n\n状态：安全校验通过，准备开始下载...`);
        }
    });

    console.log("北疆红韵项目脚本加载完成 - 极致精细版");
});
