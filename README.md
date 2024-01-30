# Delivery Fee Calculator

This is a simple web application for precisely calculating the delivery fee based on various parameters such as cart value, delivery distance, number of items, and delivery time. This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting started

1. **Clone the repository to your local machine:**
    ```bash
    git clone https://github.com/honggiakhanh/wolt-delivery-fee-calculator
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the application:**
    ```bash
    npm run dev
    ```

4. **Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to use the Delivery Fee Calculator.**

## About

The Delivery Fee Calculator offers a user-friendly interface, allowing you to presicely calculate your delivery fee based on your cart value, delivery distance, item count and desired delivery time. 
Delivery Fee Calculator was build on top of the [shadcn](https://ui.shadcn.com/) UI library, providing fully customizable and fully accessible component, adhering to Web Content Accessibility Guidelines (WCAG) standards.

## Dependencies

- React
- shadcn/ui

## How It Works

The application takes input values for cart value, delivery distance, number of items, and delivery time. The delivery fee is dynamically calculated according to a set of rules:

- Free delivery for cart values equal to or more than €200.
- Small order surcharge for cart values less than €10.
- Delivery fee based on the distance, with an additional charge for distances exceeding 1km.
- Surcharge for more than five items, with an extra "bulk" fee for more than 12 items.
- Friday rush hours multiplier (1.2x) for deliveries between 3 PM and 7 PM.
- The total delivery fee is capped at €15.

