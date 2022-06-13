import Home from '~/pages/home/Home';
import ListStudent from '~/pages/student/List';
import NewStudent from '~/pages/student/NewStudent';
import ListStaff from '~/pages/staffs/List';
import Login from '~/pages/login/Login';
import Profile from '~/pages/profile/Profile';
import StudentDetails from '~/pages/student/StudentDetails';
import Index from '~/components/Register/Index';
import AllFeeInvoices from '~/pages/allBillStudent/allFeeInvoices/allFeeInvoices';
import AllCostOfLiving from '~/pages/allBillStudent/allCostOfLiving/allCostLivings';
import NewBillCostOfLiving from '~/pages/allBillStudent/allCostOfLiving/newCostOfLiving';
import AllViolation from '~/pages/allBillStudent/allBillViolations/allFeeViolations';
import NewViolation from '~/pages/allBillStudent/allBillViolations/newFeeViolation';
import RegistrationFormStudent from '~/pages/registrationFormStudent/itemRegistrationFormStudent/RegistrationFormStudent';
import RoomBuilding from '~/pages/room/ListRoom';
import DetailRoom from '~/pages/room/DetailRoom';
import ListRegistrationForm from '~/pages/registrationFormStudent/ListRegistrations';
const publicRoutes = [{
        path: '/',
        component: Home,
    },
    {
        path: '/admin/students',
        component: ListStudent,
    },
    {
        path: '/admin/students/new',
        component: NewStudent,
    },
    {
        path: '/admin/student/:id',
        component: StudentDetails,
    },
    {
        path: '/admin/staffs',
        component: ListStaff,
    },
    {
        path: '/admin/login',
        component: Login,
        layout: null,
    },
    {
        path: '/register/index',
        component: Index,
        layout: null,
    },
    {
        path: '/profile',
        component: Profile,
    },
    {
        path: '/admin/student/fee-invoices/',
        component: AllFeeInvoices,
    },
    {
        path: '/admin/room/cost-livings/',
        component: AllCostOfLiving,
    },
    {
        path: '/admin/student/violations/',
        component: AllViolation,
    },
    {
        // path: '/admin/room/cost-of-living/',
        path: '/admin/room/:id_room/create-bill',
        component: NewBillCostOfLiving,
    },
    {
        path: '/admin/room/cost-of-living/:student',
        component: RegistrationFormStudent,
    },
    {
        path: '/admin/registration-form-student/:id_registration/:status',
        component: RegistrationFormStudent,
    },
    {
        path: '/admin/student/violation/',
        component: NewViolation,
    },
    {
        path: '/admin/rooms',
        component: RoomBuilding,
    },
    {
        path: '/admin/room/:id_room',
        component: DetailRoom,
    },
    {
        path: '/admin/all-registration-form-confirming/',
        component: ListRegistrationForm,
    },
];
const privateRoutes = [
    // {
    //   path: '/',
    //   component: Home,
    // },
    // {
    //   path: '/students/list',
    //   component: ListStudent,
    // },
    // {
    //   path: '/staffs/list',
    //   component: ListStaff,
    // },
];
export { publicRoutes, privateRoutes };