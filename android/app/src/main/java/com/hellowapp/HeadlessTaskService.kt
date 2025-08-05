package com.hellowapp

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy
import com.facebook.react.jstasks.LinearCountingRetryPolicy

class HeadlessTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        return intent?.extras?.let { extras ->
            // Create retry policy
            val retryPolicy: HeadlessJsTaskRetryPolicy = LinearCountingRetryPolicy(
                3, // Max number of retry attempts
                1000 // Delay between each retry attempt (1 second)
            )

            HeadlessJsTaskConfig(
                "HeadlessTask",
                Arguments.fromBundle(extras),
                60000, // timeout for the task (60 seconds)
                false, // optional: defines whether or not the task is allowed in foreground
                retryPolicy
            )
        }
    }
} 