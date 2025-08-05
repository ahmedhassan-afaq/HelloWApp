package com.hellowapp

import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class HeadlessTaskModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "HeadlessTaskModule"
    }

    @ReactMethod
    fun startHeadlessTask(taskData: ReadableMap) {
        val serviceIntent = Intent(reactApplicationContext, HeadlessTaskService::class.java)
        val bundle = Bundle()

        // Convert ReadableMap to Bundle - improved approach
        val iterator = taskData.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            try {
                // Check if the value is null first
                if (taskData.isNull(key)) {
                    bundle.putString(key, null)
                } else {
                    // Try to get as boolean first (since that's what we're passing)
                    try {
                        val booleanValue = taskData.getBoolean(key)
                        bundle.putBoolean(key, booleanValue)
                    } catch (e: Exception) {
                        // Try to get as number
                        try {
                            val doubleValue = taskData.getDouble(key)
                            bundle.putDouble(key, doubleValue)
                        } catch (e2: Exception) {
                            // Default to string
                            val stringValue = taskData.getString(key)
                            bundle.putString(key, stringValue)
                        }
                    }
                }
            } catch (e: Exception) {
                // If all else fails, put as string
                bundle.putString(key, taskData.getString(key))
            }
        }

        serviceIntent.putExtras(bundle)
        reactApplicationContext.startForegroundService(serviceIntent)
    }
} 