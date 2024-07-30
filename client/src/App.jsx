import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components";
import {
	Dashboard,
	DashboardMain,
	Greet,
	Home,
	JobsPage,
	Login,
	PostJob,
	Profile,
	Signup,
	ViewJob,
} from "./pages";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<main style={{ paddingTop: "3.4rem", minHeight: "100vh" }}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/explore" element={<JobsPage />} />
					<Route exact path="/dashboard" element={<Dashboard />}>
						<Route path="/dashboard" element={<DashboardMain />} />
						<Route path="/dashboard/post-job" element={<PostJob />} />
					</Route>
					<Route exact path="/job/:jobId" element={<ViewJob />} />
					<Route exact path="/greet/:jobId" element={<Greet />} />
					<Route exact path="/user/profile" element={<Profile />} />
					<Route path="*" element={<h1>Page Not Found</h1>} />
				</Routes>
			</main>
		</BrowserRouter>
	);
}

export default App;
