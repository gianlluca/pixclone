# PixClone with Create React App

This project was made targeting to be as simple as possible, no to be pretty but to show a functional integration between a ReactJS website and a Golang backend.

## The client needs the backend running to work properly.
### The backend needs docker and docker-compose.
Once you have installed type `make build && make run` if you have make installed or type `docker-compose -f docker-compose.yml build && docker-compose -f docker-compose.yml up` if you don't have it.

Once the backend is running on `http://localhost:5858` just type `npm start` on terminal in the client directory.


![pixclone signin](screens/screen0.png?raw=true "pixclone signin")

![pixclone dashboard](screens/screen1.png?raw=true "pixclone dashboard")

#

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the client project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).