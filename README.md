# ExWallet


## Description

A simple wallet built on top of the tdDex protocol.

## Installation

```bash
# Clone the repository
$ git clone https://github.com/Anyitechs/exwallet.git

# Change directory
$ cd exwallet

# Install dependencies
$ npm install

```

## Running the project

```bash
# development
$ npx expo start

```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Available Functionalites
ExWallet currently have the following functionalities powered by the tbDex protocol

- ```Get Offerings```, get and shows offerings from different PFI on the network.

- ```Match Offering```, filters offering and shows matching offerings to the user.

- ```Create DID```, creates a DID for the user.

- ```Create VC```, creates a Verified credential for the user to enable them create quote with PFIs on the network.

- ```Create Quote```, allows users to create quotes for matching offerings.

- ```Create Order```, allows users create to order.

- ```Close Order```, allows users close to order.

- ```Fetch Exchanges```, fetches all users exchanges with PFI.

### Screenshots of the app
![Group 1](https://github.com/user-attachments/assets/5d4e09dd-7b04-4c18-b939-9c2df9ac3c23)


### Design decision
- Profitability: ExWallet will make profit off transactions (charging a tiny percentage to complete each transaction), in-app advertisements and partnerships with PFIs that will bring commissions for matching customers with them.

- Optionality: ExWallet allows users to manually select which PFI they want to interact with. But in the future, we'll be adding a functionality to allow users choose if they want ExWallet to automatically pick a PfI for them based on certain criteria, like PFI reputation, rate and fastest transaction times.

- Customer Management: ExWallet currently stores the users DID and VC on their device, but also securely stores it on the ExWallet servers to enable easy backup and faster transaction completion.

- Customer Satisfaction: ExWallet will allow users rate and give feedback on each PFI after a successful transaction. This rating system will be managed by ExWallet and will be used to rate the PFIs on ExWallet and displayed to the users each time they search for offerings from the PFIs.

### TODO
- Format transaction list properly
- Listen for updates on transaction and sends the user an in-app notification and a push notification on completed orders
- Complete the notification screen
- Complete the settings screen to allow users update their name and request for a new DID and VC
- Fix UI bugs


## Stay in touch

- Author - [Ifeanyichukwu Amajuoyi](https://www.linkedin.com/in/ifeanyichukwu-amajuoyi-8b6229153/)
- Email - [Aifeanyi019@gmail.com]
