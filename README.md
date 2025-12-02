# Eventoria

A fully responsive and modern event-booking platform built from scratch for managing concerts, shows, festivals, and large-scale public events.
This website allows users to browse events, view details, book tickets, and receive confirmations instantly.  

---

## 🛠️ Tech Stack Used

- **Node.js**
- **Express.js**
- **EJS (Embedded JavaScript templates)**
- **Tailwind CSS**
- **Firebase** (for authentication)
- **MongoDB + Mongoose**
- **Razorpay Payment Gateway**
- **PDFKit** (Ticket generation)
- **QRCode** (QR code on tickets)
- **Socket.io** (Real-time chats)

---

## 🚀 Features

- Responsive UI built with Tailwind CSS.
- Dynamic routing with EJS templating.
- Ticket booking with downloadable PDF tickets.
- Community section for users to connect and communicate

---

## 🧩 Getting Started

To run this project locally:

1. **Fork or Clone** the repository:
   ```bash
   git clone https://github.com/yourusername/Eventoria.git
   cd Eventoria
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:

   Create a `.env` file in the root directory with the following variable:
   ```env
   MONGO_URI=mongodb+srv://Rashid:25@events.7g9ksyr.mongodb.net/?retryWrites=true&w=majority&appName=Events
   
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=eventoria-9da08
   FIREBASE_PRIVATE_KEY_ID=b953dcb7073194c6200f48f2e37c8f3bb7f3f14c
   FIREBASE_PRIVATE_KEY=""-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD18O2mF2PHPDsd\n07x/anRRyrOreeNbIOv4/BmFZPEeB+0VWmI0iQwuxHEcHXjEU5n9rXxBPjFd2CWg\nkbgyFPLwTzkhJbZZY6Wc997MhRW+Qx4x5To0ZbC6Se3Ln389KBHJchXvX8+kDnZg\nu91dM3B3l7jmVvo3THvYmaH2ZeaChlyI0ikGUscSbkvGNDMFG3LXkwf4QRiKvn5e\nt1a+YXN4BAcvDBkccIlq+GmDM3zQr2cx3jFnqkMQmUTI4wlGBddG0gdQIU4DOCRM\nKc2vIZxrgem++zpssnSfkIwAoXBIyDK7weoqnuNrSHN7Xsac022/Wn2/2aDF2BkR\n01SzywL3AgMBAAECggEAAJAliV07z7yEod00jEwtHmZgOmWyu0qAicJ2FnPUWuoL\n3Vr2MoIxukeMxLNay5seSGHHQVwjzZgtiUDuSZsnpm8nScwjxdknC3iC9t+S3NCQ\nNneyusWUvbwAFcYxqhIuIBEwT5QqteOqw9lPPQ5/q5jpxfKQliJQS0BvgVY+p518\nvfIuaDJviykJJki3unfZDi4ChLaKLrsCj02BTNeltsyPYcFfk//Z6EuDAc5msccX\n5DcAVmaXG3DnEqoMym9VCc08owc0NJWlPYaShT94aZQzIIZtZv/jy7Tc8JPHITvK\nH3flliwMfYADw43a/ne/6BxRP08Np+f21zmUs3LaAQKBgQD/YsCe9r52N/j5pFkc\nQeyuHlXleeQGq8LaGwzA7f9wx/Nss3J9HaNHa9x2BTsdO+YtKETaf8tCmCHitmZm\ntVnlj1AKf7kzBVaT2Nc7DzKcYWJ7cGX30U7xKsjZqEH75SEw4PVMYuZTx2NR5Jw2\n0q11GF2F8TaTKidqnQef07DM6QKBgQD2iFxPtZKimq7go4XpSfjVIaiIAlI2+7wr\niogxDPJGP5jdDblOR1u/n7iXnO65Dtqze7cvDcuYTa6LTddYyj5vepov7QneO++9\nZAVzibsuehBs6yw1Z5d281pPR/uOas3eRIwua8FdYHSRL+cCpodhO2IVG8X0/rBk\nne8rYmHk3wKBgQDiZ7XEN5MaUvzStDSbrIYaxqH30luo3lTb7ucbkuLGJT1UvLFe\n4guCocjMiE6j2BpzJiQEYQ7ddulzh6i4nUWZEbgv1pNk+/KJF8+XeB2yLVOVg0ui\nq1iEzR1KeLQmkDcgkg5lLbhrxXPzgexLXfKQwI0I1ZNAXDqddaDwvEcdIQKBgG5X\nyCFxHomi/ETVS/mHv1T9tKXzjALKF4XRgnWZ2tJwYqYGH3uW2szg20kY14yCxoZx\nCCOKZCbuFgKJu6olE17oHBz5VmJep0Y4f2wgKGR8A+AMPoREsnluIGy9xi0PRseG\nHMwmNKzroCDftODt0khFwPe7r5WhbSgLvGHJrhE3AoGBAJjHiVod238smoVxUWCE\nXeeGJoJJQPzUEOiwNBVvxa0QbalodeHR5oZi/W7AoWUKclB7hGmkPRCRmmXpJzhj\nw+X9wsIBKuCKbJ4rUTV13gF7GmfKwlDEWbRzv0Hi1sBcA2e3h5EWarnS0s3ZhP2M\nOrJZpu//5mO2ptTnj6SRx+dL\n-----END PRIVATE KEY-----\n""
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@eventoria-9da08.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=108473693422469394334
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40eventoria-9da08.iam.gserviceaccount.com
   
   RAZORPAY_KEY_ID=rzp_test_Rm1yjp19A48vec
   RAZORPAY_KEY_SECRET=TvwQ8ioOCuMsmole7Y1PBZD3
   
   SESSION_SECRET=eventoria-secret-key
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   ```

---

## 📦 Folder Structure

```
Eventoria/
├── data/
├── models/
├── public/
│   ├── audio/
│   ├── css/
│   ├── fonts/
│   ├── images/
│   ├── js/
│   └── videos/
├── views/
│   ├── partials/
│   ├── community-chat.ejs
│   ├── community.ejs
│   ├── contact-us.ejs
│   ├── description.ejs
│   ├── events.ejs
│   ├── hostloginPage.ejs
│   ├── index.ejs
│   ├── input.css
│   ├── loading.ejs
│   ├── loginPage.ejs
│   ├── signupPage.ejs
│   └── ticket-download.ejs
├── app.js
├── package.json
└── .env

```

---

## 📬 Contact

If you have any questions or feedback, feel free to reach out:

**Rashid Khan**  
📞 +91 82911 66914  
✉️ khanrashidejaz@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/rashid-ejaz-khan)

**Vaidehi Raut**  
📞 +91 78881 63876  
✉️ vaidehiraut21@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/vaidehi-raut-9563052b9/)

---

## 📄 License

This project is for personal and portfolio use. Please contact before commercial use or modifications.
