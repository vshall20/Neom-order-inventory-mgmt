Product Requirements Document (PRD) for Order Management App

1. Overview

The Order Management App is designed for a modular kitchen company to manage and track orders, update their status, and maintain logs of activities performed by different users. The app will have role-based access, with Admins having full access to all functionalities and Members restricted to viewing and updating orders only.

2. User Roles and Permissions

   • Admin
   • Can add, edit, delete orders.
   • Can view all orders and order details.
   • Can update order statuses.
   • Can manage user accounts (create, edit, delete).
   • Member
   • Can view the list of orders.
   • Can view order details.
   • Can update the status of orders.

3. Core Features

3.1 Authentication & User Management

    •	Login/Logout: Secure login/logout system with email and password using Supabase Auth.
    •	Role-Based Access Control: Admins have full access, Members have restricted access.
    •	User Management (Admin Only):
    	•	Create new users (Admins Only).
    	•	Edit user information.
    	•	Delete users (Admins Only).

3.2 Order Management

    •	Add Order (Admin Only):

• Fields: Order ID, Party ID, Area (Dropdown), Order Type (Dropdown), Order Quantity, SqFt, Order Date, Status (Dropdown, Value depends on Order Type).
• Order Types : 1.5MM ACRYLIC, PU SHUTTER, GRECO-ANTI SCRATCH ACRYLIC, etc.
• Area Options : Vashi, Nerul, Koparkhairane, Turbha, etc.
• View Orders (All Users):
• List view of all orders with columns: Order ID, Party ID, Date, Order Age, Last Updated On Date, Current Status.
• Search and filter functionality.
• Export/download the order list.
• Order Details (All Users):
• Detailed view of a selected order.
• Display order information: Order ID, Party ID, Order Type, Order Quantity, Order Date, Order Created By, Current Order Status.
• Show status update history below the order details (status, user, and timestamp).
• Update Order Status (All Users):
• Members and Admins can update the status of the order.
• Statuses and sequence of the status are based on Order Type, example: BOM, Cleaning, Cutting Start, Cutting Finish, EB, Drilling, etc.
• Capture the user who updated the status and the timestamp and show the timeline of the status changes.

3.3 Dashboard

    •	Admin Dashboard:
    	•	Displays key order metrics: Pending Orders, Orders by Status, Daily Work.
    	•	Pending Orders: Shows the count of pending orders categorized by order type.
    	•	Orders by Status: Displays orders categorized by their current status.
    	•	Daily Work: Visual representation of daily work items across different stages (e.g., BOM, Cleaning, Cutting).

3.4 Activity Logging

    •	Maintain a log for each order status update capturing:
    •	Previous status.
    •	New status.
    •	User who made the change.
    •	Timestamp of the change.

4. Non-Functional Requirements

   • Performance: The app should load within 2 seconds for any page.
   • Scalability: Should support up to 500 simultaneous users without performance degradation.
   • Security: Data encryption, secure API communication, and user authentication using Supabase.
   • Usability: Intuitive UI/UX design suitable for non-technical users.

5. Technical Requirements

   • Frontend: React.
   • Backend: Pocketbase for database management, authentication, and real-time functionalities.
   • Database: Pocketbase's SQLite for storing order data, user data, and activity logs.
   • Authentication: Pocketbase Auth (email/password, JWT-based authentication).
   • Hosting: Deploy on Netlify for the React.js frontend and Deploy Pocketbase as Docker on Oracle server for the backend.

6. User Interface (UI) Details

   • Login Page:
   • Input fields for Email and Password, integrated with Pocketbase Auth.
   • Dashboard (Admin):
   • Sections for Pending Orders, Orders by Status, and Daily Work.
   • Buttons and dropdowns for navigation and data filtering.
   • Order List Page:
   • Table with columns for Order ID, Party ID, Date, Order Age, Last Updated On Date, Status.
   • Search bar for filtering orders.
   • Add Order Page:
   • Form fields for entering order details.
   • Dropdowns for “Area” and “Order Type.”
   • Order Detail Page:
   • Display order information.
   • Section to update order status with a checkbox interface.
   • Section to show all the statuses and their timestamps and who updated the order if the status is completed else show the status as disabled.
   • Button to save changes or delete the order.

7. Testing Requirements

   • Unit tests for all components and APIs using Jest and React Testing Library.
   • Integration tests for end-to-end user scenarios.
   • Security tests for authentication and data access.
