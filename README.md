# Why
A friend complained to me how awful it was to generate Mindmaps, even when they already had the Mindmap content from notes they had created. They tried using various website tools to no avail, as a last resort, I asked them to see if AI could do it (as expected it did not). It was suprising to me, considering how widespread Mindmaps are, that you could not easily create lots of Mindmaps based on data you already had, without manually creating the Mindmap.

This tool is for that, it would have been weeks for this person to put their notes into a Mindmap. Doing Mindmaps in the future would quickly take up months or years of their life in total, which is not efficient. This tool exists to solve that.

# About
### Generating Mindmaps
This tool supports uploading a .TXT file (.docx coming soon). Based on bullet-points, dashes, etc, it will generate a Mindmap. The Mindmap is a webpage and not a static image, this means Mindmaps can easily be edited.

<img width="600" alt="Screenshot 2024-08-15 at 1 38 37 PM" src="https://github.com/user-attachments/assets/25d35a6e-bd46-4dd2-af69-bdf68e7b520f">

### Keywords
You can then add "Keywords" to the database, so when you open any of your Mindmaps, any time that keyword appears you can hover on it and get information. For example, you could set a keyword for "neuron" and include information about neurons. This makes studying for students easier.

(The keyword UI with my test input)

<img width="600" alt="Screenshot 2024-08-15 at 1 33 54 PM" src="https://github.com/user-attachments/assets/b04029e7-bd1b-4515-af6f-c2a02cf05d12">
<img width="600" alt="Screenshot 2024-08-15 at 1 34 00 PM" src="https://github.com/user-attachments/assets/91ab06f0-56db-47c2-ab73-2d4b2344acd4">


# A note about the code
A significant portion of this code was written whilst I was sleep deprived in a short period of time. It's currently is not commented (shocker), the code has TODO comments and code for features that were dropped. I will go through and clean it all up with any spare time I have over the next few days.

# What's on the TODO?
- Cleaning up code (actually pretty good already, but some naming could be clearer, and some deprecated code needs to be removed).
- Fixing some potential collision issues at scale.
- Allowing direct image uploads.
- You can't edit Mindmaps, the code exists in the backend, but it's not connected to the frontend. This also means you can't really delete anything.
- Add some missing dialogs.
- Add .docx support.
