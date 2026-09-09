package com.pokoritel.bashni

import android.app.Activity
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                // Игра должна работать автономно: блокируем внешние HTTP/HTTPS-запросы.
                val scheme = request?.url?.scheme?.lowercase()
                if (scheme == "http" || scheme == "https") {
                    return WebResourceResponse("text/plain", "UTF-8", null)
                }
                return super.shouldInterceptRequest(view, request)
            }
        }

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = false
        settings.databaseEnabled = true
        settings.cacheMode = WebSettings.LOAD_NO_CACHE
        settings.setSupportZoom(false)

        // localStorage находится в данных приложения и сохраняется при обычном обновлении APK.
        webView.loadUrl("file:///android_asset/game.html")
        setContentView(webView)
    }

    override fun onBackPressed() {
        // Не закрываем игру случайным нажатием системной кнопки "Назад".
        // Навигация внутри игры управляется самой HTML-игрой.
        if (isFinishing) return
    }
}
