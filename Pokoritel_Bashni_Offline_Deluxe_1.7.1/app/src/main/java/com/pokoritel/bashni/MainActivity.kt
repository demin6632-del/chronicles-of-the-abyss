package com.pokoritel.bashni

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val text = TextView(this)
        text.text = "Pokoritel Bashni Offline Deluxe 1.7.1"
        setContentView(text)
    }
}
