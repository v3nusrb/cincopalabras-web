@echo off
echo Building the app...
npm run build

echo Copying files to root...
xcopy dist\* . /E /Y

echo Build and deploy complete!
echo Your app is ready for GitHub Pages.



