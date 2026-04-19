/**
 * 北疆红韵 - 核心交互脚本 (大创项目深度细化版)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 移动端菜单切换
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // 返回顶部功能
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

    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.height = '60px';
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.top = '60px');
        } else {
            navbar.style.height = '70px';
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.top = '70px');
        }
    });

    // 分类筛选功能模拟
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 切换按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            filterItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // 资源下载模拟
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('resource-download') || e.target.closest('.resource-download')) {
            e.preventDefault();
            const fileName = e.target.getAttribute('data-file') || '资源文件';
            alert(`正在准备下载：${fileName}\n\n提示：大创演示环境已模拟云端请求，完整资源包请访问项目附件。`);
        }
    });

    // 留言板处理
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(feedbackForm);
            alert(`提交成功！\n\n感谢您对“北疆红韵”项目的关注。您的建议（${formData.get('type')}）已存入云端数据库，我们将尽快处理。`);
            feedbackForm.reset();
        });
    }
});
