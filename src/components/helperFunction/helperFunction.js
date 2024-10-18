// import * as firebaseService from '../../services/firebase';
// import * as uiService from '../../services/ui';

// const cancelRide = (props) => {
//     const { id, setCurrentRide } = props;
//     const isCancel = window.confirm('Do you want to cancel this ride?');
//     if (isCancel) {
//         cancelRideApiCall();
//     }
   
//     const cancelRideApiCall = async () => {
//         uiService.showLoading();
//         try {
//             await firebaseService.update({
//                 key: 'rides',
//                 id,
//                 payload: { status: 'canceled' },
//             });
//         } catch (error) {
//             uiService.hideLoading();
//         }
//         uiService.hideLoading();
//         removeRide();
//     };
//      const removeRide = () => {
//         localStorage.removeItem('currentRide');
//         // setCurrentRide(null);
//         window.location.reload();
//     };
    
// };
// export { cancelRide };
