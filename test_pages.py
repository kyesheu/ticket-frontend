from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 900})
    page = context.new_page()

    # 1) Login page
    print("=== 1) Login page ===")
    page.goto('http://localhost:80', timeout=15000)
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/v13_login.png', full_page=True)
    print("Screenshot saved: /tmp/v13_login.png")

    # 2) Navigate to /ticket/notification (v1.2)
    print("\n=== 2) /ticket/notification ===")
    try:
        page.goto('http://localhost:80/ticket/notification', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/v13_notification.png', full_page=True)
        title = page.title()
        print(f"Page title: {title}")
        print("Screenshot: /tmp/v13_notification.png")
    except Exception as e:
        print(f"Error: {e}")

    # 3) Navigate to /ticket/sla (v1.1)
    print("\n=== 3) /ticket/sla ===")
    try:
        page.goto('http://localhost:80/ticket/sla', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/v13_sla.png', full_page=True)
        title = page.title()
        print(f"Page title: {title}")
        print("Screenshot: /tmp/v13_sla.png")
    except Exception as e:
        print(f"Error: {e}")

    # 4) Navigate to /ticket/sla-alert (v1.1)
    print("\n=== 4) /ticket/sla-alert ===")
    try:
        page.goto('http://localhost:80/ticket/sla-alert', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/v13_sla_alert.png', full_page=True)
        title = page.title()
        print(f"Page title: {title}")
        print("Screenshot: /tmp/v13_sla_alert.png")
    except Exception as e:
        print(f"Error: {e}")

    # 5) Navigate to /ticket/ticket (main ticket page - v1.0 + v1.1 + v1.2 + v1.3 changes)
    print("\n=== 5) /ticket/ticket ===")
    try:
        page.goto('http://localhost:80/ticket/ticket', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/v13_ticket.png', full_page=True)
        title = page.title()
        print(f"Page title: {title}")
        print("Screenshot: /tmp/v13_ticket.png")
    except Exception as e:
        print(f"Error: {e}")

    # 6) Check browser console for errors
    print("\n=== Console Errors ===")
    # Reload and capture logs
    page.on('console', lambda msg: print(f"[{msg.type}] {msg.text}") if msg.type in ('error', 'warning') else None)
    page.goto('http://localhost:80/ticket/notification', timeout=15000)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    browser.close()
    print("\nDone.")
