# 📖 Admin Guide - Video Link Management

## 🎯 Quick Access

**Path:** Settings → Admin Tools → "Edit Activities & Videos"  
**Direct URL:** `http://localhost:3001/admin/edit-activities`

---

## 📝 Step-by-Step: How to Edit Video Links

### Step 1: Navigate to Editor
1. Log in to your account
2. Go to **Settings** page
3. Scroll to **"Admin Tools"** section (purple box)
4. Click **"✏️ Edit"** button

### Step 2: Select Activity to Edit
1. You'll see a list of all activities
2. Each activity shows:
   - Title
   - Description
   - Category
   - Number of steps
   - Current video links (if any)
3. Click **"✏️ Edit"** button on the activity you want to modify

### Step 3: Edit Activity Details (Optional)
- **Title:** Update the activity name
- **Description:** Modify the activity description
- Both are optional - you can just edit video links

### Step 4: Add/Edit Video Links
For each step in the activity:
1. Find the **"Video URL"** input field
2. Paste your video link
3. Click **"🔗 Test link"** to verify it works
4. Repeat for all steps

### Step 5: Save Changes
1. Click **"✓ Save Changes"** button
2. Wait for success message
3. Click **"Cancel"** or edit another activity

---

## 🎥 Supported Video Platforms

### YouTube
**Format:** `https://youtube.com/watch?v=VIDEO_ID`  
**Example:** `https://youtube.com/watch?v=dQw4w9WgXcQ`

### Vimeo
**Format:** `https://vimeo.com/VIDEO_ID`  
**Example:** `https://vimeo.com/123456789`

### Direct Video Links
**Format:** `https://example.com/video.mp4`  
**Supported:** `.mp4`, `.webm`, `.ogg`

---

## ✅ Best Practices

### 1. Test All Links
- Always click "🔗 Test link" before saving
- Verify video plays in new tab
- Check for correct video content

### 2. Use Quality Videos
- Prefer HD quality (720p or higher)
- Ensure clear audio
- Keep videos concise (2-10 minutes)

### 3. Consistent Format
- Use same platform for all videos (e.g., all YouTube)
- Maintain similar video style
- Use descriptive video titles

### 4. Regular Updates
- Check links monthly
- Remove broken links
- Update with better content when found

---

## 🔧 Troubleshooting

### Video Link Not Working?
**Problem:** Link shows "No video link" or doesn't play

**Solutions:**
1. Check URL format is correct
2. Ensure video is public (not private)
3. Test link in browser first
4. Save and refresh page

### Can't Save Changes?
**Problem:** Save button doesn't work

**Solutions:**
1. Check all required fields filled
2. Check browser console (F12) for errors
3. Refresh page and try again
4. Clear browser cache

### Activity Not Showing?
**Problem:** Activity doesn't appear in list

**Solutions:**
1. Check database has activities (run seed script)
2. Refresh page
3. Check browser console for errors
4. Restart server

---

## 📊 Current Activity Structure

Each activity has:
- **Title:** Name of activity
- **Description:** What the activity is about
- **Category:** Type (Mindfulness, Fitness, etc.)
- **Difficulty:** Easy, Medium, or Hard
- **Estimated Time:** Minutes to complete
- **Steps:** 3-5 steps with:
  - Step number
  - Step title
  - Step description
  - Tips array
  - **Video URL** ⭐ (editable)
  - Estimated duration

---

## 🎯 Example: Updating "Morning Meditation"

### Before:
```
Step 1: Find Your Space
Video: (no video)
```

### After:
```
Step 1: Find Your Space
Video: https://youtube.com/watch?v=abc123
```

### How to Do It:
1. Go to Edit Activities page
2. Find "Morning Meditation"
3. Click "Edit"
4. Find "Step 1" section
5. Paste YouTube link in "Video URL" field
6. Click "Test link" to verify
7. Click "Save Changes"
8. Done! ✅

---

## 🔐 Security Notes

### Admin Access
- Only logged-in users can access
- Link in Settings page
- No public access

### Data Safety
- All changes saved to database
- Can revert by re-editing
- Original data not lost

### Backup Recommendation
- Keep list of video links separately
- Document changes made
- Test after every update

---

## 📞 Quick Reference

### URLs
- **Edit Page:** `/admin/edit-activities`
- **Settings:** `/settings`
- **Activities:** `/activities`

### Buttons
- **✏️ Edit** - Start editing
- **✓ Save Changes** - Save to database
- **Cancel** - Discard changes
- **🔗 Test link** - Open video in new tab
- **← Back** - Return to previous page

### Shortcuts
- **Ctrl+S** - (Won't save, use button)
- **Esc** - Close without saving
- **F5** - Refresh page

---

## 🎉 You're All Set!

You can now:
- ✅ Edit activity details
- ✅ Add video links to any step
- ✅ Update existing video links
- ✅ Test links before saving
- ✅ Manage all activities easily

**Happy editing!** 🚀
