// File: android/app/src/main/java/com/privacycontroll/AppListModule.kt
package com.privacycontroll

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.net.Uri
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class AppListModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppList"

    /**
     * Returns array of apps. Each app object: {
     *   packageName, label, versionName, versionCode (double), isSystem (boolean), iconUri (string? file://)
     * }
     */
    @ReactMethod
    fun getInstalledApps(includeSystem: Boolean, promise: Promise) {
        Thread {
            try {
                val pm: PackageManager = reactContext.packageManager
                val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
                val result: WritableArray = Arguments.createArray()

                for (appInfo in apps) {
                    val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                    if (!includeSystem && isSystemApp) continue

                    val map: WritableMap = Arguments.createMap()
                    val packageName = appInfo.packageName
                    val label = pm.getApplicationLabel(appInfo)?.toString() ?: packageName

                    map.putString("packageName", packageName)
                    map.putString("label", label)
                    map.putBoolean("isSystem", isSystemApp)

                    // version info (best-effort)
                    try {
                        val pkgInfo = pm.getPackageInfo(packageName, 0)
                        map.putString("versionName", pkgInfo.versionName ?: "")
                        try {
                            map.putDouble("versionCode", pkgInfo.longVersionCode.toDouble())
                        } catch (t: Throwable) {
                            map.putDouble("versionCode", 0.0)
                        }
                    } catch (ignored: Exception) {
                        map.putString("versionName", "")
                        map.putDouble("versionCode", 0.0)
                    }

                    // Try to save icon to cache and return file URI (best-effort)
                    try {
                        val iconUri = saveAppIconToCache(packageName, pm)
                        if (iconUri != null) {
                            map.putString("iconUri", iconUri.toString())
                        } else {
                            map.putNull("iconUri")
                        }
                    } catch (e: Exception) {
                        map.putNull("iconUri")
                    }

                    result.pushMap(map)
                }

                reactContext.runOnUiQueueThread { promise.resolve(result) }
            } catch (e: Exception) {
                reactContext.runOnUiQueueThread { promise.reject("APP_LIST_ERROR", e.message) }
            }
        }.start()
    }

    /**
     * Save drawable icon to cache dir and return Uri or null on failure.
     */
    private fun saveAppIconToCache(packageName: String, pm: PackageManager): Uri? {
        try {
            val drawable: Drawable = pm.getApplicationIcon(packageName)
            val bitmap = drawableToBitmap(drawable)
            val cacheDir = reactContext.cacheDir
            val iconsDir = File(cacheDir, "app_icons")
            if (!iconsDir.exists()) iconsDir.mkdirs()
            val outFile = File(iconsDir, "${packageName.replace(Regex("[^A-Za-z0-9_.-]"), "_")}.png")
            var out: FileOutputStream? = null
            try {
                out = FileOutputStream(outFile)
                bitmap.compress(Bitmap.CompressFormat.PNG, 90, out)
                out.flush()
                return Uri.fromFile(outFile)
            } finally {
                try { out?.close() } catch (ignored: IOException) {}
            }
        } catch (e: Exception) {
            return null
        }
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable) {
            drawable.bitmap?.let { return it }
        }
        val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 48
        val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 48
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        return bitmap
    }

    /**
     * Optional helper to fetch icon for single package from JS:
     * AppList.getAppIcon(packageName) -> resolves file:// URI or null
     */
    @ReactMethod
    fun getAppIcon(packageName: String, promise: Promise) {
        Thread {
            try {
                val pm = reactContext.packageManager
                val uri = saveAppIconToCache(packageName, pm)
                reactContext.runOnUiQueueThread {
                    if (uri != null) promise.resolve(uri.toString()) else promise.resolve(null)
                }
            } catch (e: Exception) {
                reactContext.runOnUiQueueThread { promise.reject("ICON_ERROR", e.message) }
            }
        }.start()
    }
}
