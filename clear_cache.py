from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动浏览器，清除所有存储
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(
        viewport={'width': 1440, 'height': 900},
        # 不传 storageState 即全新无缓存状态
    )

    page = context.new_page()

    # 先清除该域名下所有存储
    page.goto('http://localhost:80', timeout=15000)
    page.evaluate('localStorage.clear()')
    page.evaluate('sessionStorage.clear()')

    # 重新加载
    page.goto('http://localhost:80', timeout=15000)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    # 截图看效果
    page.screenshot(path='/tmp/v14_home.png', full_page=True)

    # 导航到首页
    page.goto('http://localhost:80/index', timeout=15000)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    page.screenshot(path='/tmp/v14_home2.png', full_page=True)

    print("Cleared all cache. Browser is open at http://localhost:80")
    print("Screenshots: /tmp/v14_home.png, /tmp/v14_home2.png")
    input("Press Enter to close browser...")
    browser.close()
