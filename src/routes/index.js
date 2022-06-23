import Home from '~/pages/home/Home';
import ListStudent from '~/pages/student/ListStudent';
import NewStudent from '~/pages/student/NewStudent';
import ListStaff from '~/pages/staffs/List';
import Login from '~/pages/login/Login';
import Profile from '~/pages/profile/Profile';
import StudentDetails from '~/pages/student/StudentDetails';
import Index from '~/components/Register/Index';
import ListBillCostOfLiving from '~/pages/allBillStudent/allCostOfLiving/ListBillCostOfLiving';
import NewBillCostOfLiving from '~/pages/allBillStudent/allCostOfLiving/newCostOfLiving';
import AllViolation from '~/pages/allBillStudent/allBillViolations/allFeeViolations';
import NewViolation from '~/pages/allBillStudent/allBillViolations/newFeeViolation';
import RegistrationFormStudent from '~/pages/registrationFormStudent/itemRegistrationFormStudent/RegistrationFormStudent';
import RoomBuilding from '~/pages/room/ListRoom';
import DetailRoom from '~/pages/room/DetailRoom';
import ListRegistrationForm from '~/pages/registrationFormStudent/ListRegistrations';
import ListFeeInvoices from '~/pages/allBillStudent/allFeeInvoices/listFeeInvoices';
import ListFeeViolations from '../pages/allBillStudent/allBillViolations/ListFeeViolation';
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
        path: '/admin/student/:id_student',
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
        path: '/admin/room/cost-livings/:id_room',
        component: ListBillCostOfLiving,
    },
    {
        path: '/admin/cost-livings/',
        component: ListBillCostOfLiving,
    },
    {
        path: '/admin/student/violations/:id_student',
        component: ListFeeViolations,
    },
    {
        path: '/admin/violations/',
        component: ListFeeViolations,
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
        path: '/admin/student/create/violation/:id_student',
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
    {
        path: '/admin/all-fee-invoices/',
        component: ListFeeInvoices,
    },
    {
        path: '/admin/student/all-fee-invoices/:id_student',
        component: ListFeeInvoices,
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