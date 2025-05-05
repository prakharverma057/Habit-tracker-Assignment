import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  PlusCircle,
  CheckCircle,
  Bell,
  TrendingUp,
  Activity,
  Moon,
  Droplets,
  Smartphone,
  Clock,
  Settings,
  Calendar,
  Award,
  User,
} from "lucide-react";

const LifeTrackerApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showReminder, setShowReminder] = useState(true);

  // Personal stats data
  const [personalStats, setPersonalStats] = useState({
    sleep: {
      today: 7.5,
      goal: 8,
      unit: "hours",
      weekData: [
        { day: "Mon", value: 7.2 },
        { day: "Tue", value: 6.5 },
        { day: "Wed", value: 8 },
        { day: "Thu", value: 7.5 },
        { day: "Fri", value: 7.5 },
        { day: "Sat", value: 9 },
        { day: "Sun", value: 8.3 },
      ],
      streak: 30,
    },
    water: {
      today: 5,
      goal: 8,
      unit: "glasses",
      weekData: [
        { day: "Mon", value: 6 },
        { day: "Tue", value: 8 },
        { day: "Wed", value: 7 },
        { day: "Thu", value: 5 },
        { day: "Fri", value: 5 },
        { day: "Sat", value: 4 },
        { day: "Sun", value: 6 },
      ],
      streak: 15,
    },
    screenTime: {
      today: 4.5,
      goal: 3,
      unit: "hours",
      weekData: [
        { day: "Mon", value: 5.2 },
        { day: "Tue", value: 3.5 },
        { day: "Wed", value: 4.1 },
        { day: "Thu", value: 4.5 },
        { day: "Fri", value: 4.5 },
        { day: "Sat", value: 2.5 },
        { day: "Sun", value: 3.0 },
      ],
      streak: 0,
    },
  });

  // Habits data
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Morning Meditation",
      target: 15,
      unit: "minutes",
      completed: true,
      streak: 12,
    },
    {
      id: 2,
      name: "Read",
      target: 30,
      unit: "minutes",
      completed: false,
      streak: 5,
    },
    {
      id: 3,
      name: "Exercise",
      target: 45,
      unit: "minutes",
      completed: false,
      streak: 3,
    },
    {
      id: 4,
      name: "Journal",
      target: 1,
      unit: "entry",
      completed: true,
      streak: 20,
    },
  ]);

  const [newHabit, setNewHabit] = useState("");
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  // Overall weekly progress chart data
  const progressData = [
    { name: "Mon", habits: 3, sleep: 90, water: 75, screen: 40 },
    { name: "Tue", habits: 4, sleep: 81, water: 100, screen: 85 },
    { name: "Wed", habits: 2, sleep: 100, water: 88, screen: 69 },
    { name: "Thu", habits: 3, sleep: 94, water: 63, screen: 55 },
    { name: "Fri", habits: 2, sleep: 94, water: 63, screen: 55 },
    { name: "Sat", habits: 4, sleep: 112, water: 50, screen: 100 },
    { name: "Sun", habits: 3, sleep: 104, water: 75, screen: 83 },
  ];

  const toggleHabitCompletion = (id: number) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const addNewHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: habits.length + 1,
          name: newHabit,
          target: 1,
          unit: "times",
          completed: false,
          streak: 0,
        },
      ]);
      setNewHabit("");
      setIsAddingHabit(false);
    }
  };

  const updateHabitValue = (id: number, value: number) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, target: value } : habit
      )
    );
  };

  const updateStatValue = (stat: keyof typeof personalStats, value: number) => {
    setPersonalStats({
      ...personalStats,
      [stat]: {
        ...personalStats[stat],
        today: value,
      },
    });
  };

  // Calculated values for the dashboard
  const completedHabits = habits.filter((habit) => habit.completed).length;
  const totalHabits = habits.length;

  // Calculate if any stats need attention
  type StatKey = keyof typeof personalStats;
  const statsNeedingAttention = (
    Object.keys(personalStats) as StatKey[]
  ).filter((key) => {
    const stat = personalStats[key];
    // For screen time, we want to be under goal
    if (key === "screenTime") {
      return stat.today > stat.goal;
    }
    // For other stats, we want to be above goal
    return stat.today < stat.goal;
  });

  interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    label: string;
  }
  const TabButton = ({ isActive, onClick, label }: TabButtonProps) => {
    return (
      <button
        className={`px-4 py-2 font-medium whitespace-nowrap hover:cursor-pointer hover:bg-sky-50 hover:rounded-3xl ${
          isActive
            ? "text-sky-600 border-1 rounded-3xl bg-sky-100 border-sky-400"
            : "text-gray-500"
        }`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  };

  interface SummaryCardProps {
    statLogic: React.ReactNode;
    label: string;
    className: string;
    clipArt: React.ReactNode;
    goalLogic?: React.ReactNode;
    goal?: boolean;
  }

  const SummaryCard = ({
    label,
    statLogic,
    className,
    clipArt,
    goalLogic,
    goal,
  }: SummaryCardProps) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm hover:scale-103 hover:shadow-lg transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold">{statLogic}</p>
          </div>
          <div
            className={`h-10 w-10 rounded-full ${className} flex items-center justify-center`}
          >
            {clipArt}
          </div>
        </div>
        {goal ? goalLogic : null}
      </div>
    );
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-sky-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Habitricky</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sky-200 hover:scale-103 transition-transform duration-200">
              Prakhar Verma
            </span>
            <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center hover:scale-105 transition-transform duration-200">
              <span className="font-bold ">
                <User className="" />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 overflow-y-auto">
        {/* Reminder Alert (conditionally rendered) */}
        {showReminder && statsNeedingAttention.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded shadow-sm">
            <div className="flex items-start">
              <Bell className="text-amber-500 mr-3 mt-0.5" size={20} />
              <div className="flex-grow">
                <h3 className="font-medium text-amber-800">Reminder</h3>
                <p className="text-amber-700 text-sm">
                  You need to{" "}
                  {statsNeedingAttention.includes("screenTime")
                    ? "reduce your screen time"
                    : ""}
                  {statsNeedingAttention.includes("screenTime") &&
                  statsNeedingAttention.length > 1
                    ? " and "
                    : ""}
                  {statsNeedingAttention.includes("water")
                    ? "drink more water"
                    : ""}
                  {statsNeedingAttention.includes("water") &&
                  statsNeedingAttention.includes("sleep")
                    ? " and "
                    : ""}
                  {statsNeedingAttention.includes("sleep")
                    ? "get more sleep"
                    : ""}{" "}
                  today.
                </p>
              </div>
              <button
                onClick={() => setShowReminder(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-sky-50 mb-6 overflow-x-auto">
          <TabButton
            label="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />

          <TabButton
            label="Personal Stats"
            isActive={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
          />
          <TabButton
            label="Habits"
            isActive={activeTab === "habits"}
            onClick={() => setActiveTab("habits")}
          />
          <TabButton
            label="Activity log"
            isActive={activeTab === "activity"}
            onClick={() => setActiveTab("activity")}
          />
          <TabButton
            label="Trends"
            isActive={activeTab === "trends"}
            onClick={() => setActiveTab("trends")}
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Summary Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                label={"Habits"}
                className={"bg-sky-100"}
                statLogic={`${completedHabits} / ${totalHabits}`}
                clipArt={<CheckCircle className="text-sky-600" size={20} />}
                goal={false}
              />

              <SummaryCard
                label={"Sleep"}
                className={"bg-sky-100"}
                statLogic={`${personalStats.sleep.today}h`}
                clipArt={<Moon className="text-blue-600" size={20} />}
                goal={true}
                goalLogic={
                  <p
                    className={`text-xs mt-1 ${
                      personalStats.sleep.today >= personalStats.sleep.goal
                        ? "text-green-500"
                        : "text-amber-500"
                    }`}
                  >
                    Goal: {personalStats.sleep.goal}h
                  </p>
                }
              />

              <SummaryCard
                label={"Water"}
                className={" bg-cyan-100"}
                statLogic={`${personalStats.water.today}/${personalStats.water.goal}`}
                clipArt={<Droplets className="text-cyan-600" size={20} />}
                goal={true}
                goalLogic={
                  <div className="w-full bg-sky-50 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-cyan-600 h-1.5 rounded-full"
                      style={{
                        width: `${
                          (personalStats.water.today /
                            personalStats.water.goal) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                }
              />

              <SummaryCard
                label={"Screen Time"}
                className={"text-purple-600"}
                statLogic={`${personalStats.screenTime.today}h`}
                clipArt={<Moon className="text-blue-600" size={20} />}
                goal={true}
                goalLogic={
                  <p
                    className={`text-xs mt-1 ${
                      personalStats.screenTime.today <=
                      personalStats.screenTime.goal
                        ? "text-green-500"
                        : "text-amber-500"
                    }`}
                  >
                    Goal: Under {personalStats.screenTime.goal}h
                  </p>
                }
              />
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Weekly Progress
                </h2>
                <select className="text-sm border-gray-300 rounded-md">
                  <option>All Metrics</option>
                  <option>Habits Only</option>
                  <option>Sleep Only</option>
                  <option>Water Only</option>
                  <option>Screen Time Only</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="habits"
                      name="Habits %"
                      stroke="#6366F1"
                    />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      name="Sleep %"
                      stroke="#2563EB"
                    />
                    <Line
                      type="monotone"
                      dataKey="water"
                      name="Water %"
                      stroke="#06B6D4"
                    />
                    <Line
                      type="monotone"
                      dataKey="screen"
                      name="Screen Time %"
                      stroke="#A855F7"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Log Section */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Log
              </h2>

              {/* Personal Stats */}
              <div className="space-y-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Moon className="text-blue-600 mr-3" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-800">Sleep</h3>
                        <div className="text-sm text-gray-500">
                          Goal: {personalStats.sleep.goal} hours
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {personalStats.sleep.today} hours
                    </div>
                  </div>

                  <div className="pl-10 pr-4">
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      value={personalStats.sleep.today}
                      onChange={(e) =>
                        updateStatValue("sleep", parseFloat(e.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0h</span>
                      <span>12h</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Droplets className="text-cyan-600 mr-3" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-800">Water</h3>
                        <div className="text-sm text-gray-500">
                          Goal: {personalStats.water.goal} glasses
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {personalStats.water.today} glasses
                    </div>
                  </div>

                  <div className="pl-10 pr-4">
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={personalStats.water.today}
                      onChange={(e) =>
                        updateStatValue("water", parseInt(e.target.value))
                      }
                      className="w-full accent-cyan-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>12</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Smartphone className="text-purple-600 mr-3" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Screen Time
                        </h3>
                        <div className="text-sm text-gray-500">
                          Goal: Under {personalStats.screenTime.goal} hours
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {personalStats.screenTime.today} hours
                    </div>
                  </div>

                  <div className="pl-10 pr-4">
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      value={personalStats.screenTime.today}
                      onChange={(e) =>
                        updateStatValue(
                          "screenTime",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0h</span>
                      <span>12h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Habits Quick Log */}
              <h3 className="font-medium text-gray-800 mb-3">Today's Habits</h3>
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center">
                    <button
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={`${
                        habit.completed ? "text-green-500" : "text-gray-300"
                      } mr-3`}
                    >
                      <CheckCircle size={24} />
                    </button>
                    <span
                      className={`flex-grow ${
                        habit.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {habit.name} ({habit.target} {habit.unit})
                    </span>
                    <span className="text-gray-500 text-sm">
                      Streak: {habit.streak} days
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personal Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Sleep Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200">
              <div className="flex items-center mb-4">
                <Moon className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Sleep</h2>
                <div className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {personalStats.sleep.streak} day streak
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={personalStats.sleep.weekData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 12]} />
                        <Tooltip />
                        <Bar dataKey="value" name="Hours" fill="#2563EB">
                          {personalStats.sleep.weekData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.value >= personalStats.sleep.goal
                                  ? "#2563EB"
                                  : "#93C5FD"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Log Today's Sleep
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        value={personalStats.sleep.today}
                        onChange={(e) =>
                          updateStatValue("sleep", parseFloat(e.target.value))
                        }
                        className="flex-grow accent-blue-600 mr-4"
                      />
                      <div className="text-xl font-bold text-gray-800">
                        {personalStats.sleep.today}h
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0h</span>
                      <span>{personalStats.sleep.goal}h (Goal)</span>
                      <span>12h</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Sleep Stats
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Average this week
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {(
                            personalStats.sleep.weekData.reduce(
                              (sum, day) => sum + day.value,
                              0
                            ) / 7
                          ).toFixed(1)}
                          h
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Best day</p>
                        <p className="text-xl font-bold text-gray-800">
                          {Math.max(
                            ...personalStats.sleep.weekData.map(
                              (day) => day.value
                            )
                          )}
                          h
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Goal achievement
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {
                            personalStats.sleep.weekData.filter(
                              (day) => day.value >= personalStats.sleep.goal
                            ).length
                          }
                          /7 days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:cursor-pointer hover:scale-102 hover:shadow-lg transition-transform duration-200">
                      Adjust Sleep Goal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Water Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200 ">
              <div className="flex items-center mb-4">
                <Droplets className="text-cyan-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  Water Intake
                </h2>
                <div className="ml-auto px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                  {personalStats.water.streak} day streak
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={personalStats.water.weekData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="value" name="Glasses" fill="#06B6D4">
                          {personalStats.water.weekData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.value >= personalStats.water.goal
                                  ? "#06B6D4"
                                  : "#A5F3FC"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Log Today's Water
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={personalStats.water.today}
                        onChange={(e) =>
                          updateStatValue("water", parseInt(e.target.value))
                        }
                        className="flex-grow accent-cyan-600 mr-4"
                      />
                      <div className="text-xl font-bold text-gray-800">
                        {personalStats.water.today} glasses
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{personalStats.water.goal} (Goal)</span>
                      <span>12</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Water Stats
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Average this week
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {(
                            personalStats.water.weekData.reduce(
                              (sum, day) => sum + day.value,
                              0
                            ) / 7
                          ).toFixed(1)}{" "}
                          glasses
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Best day</p>
                        <p className="text-xl font-bold text-gray-800">
                          {Math.max(
                            ...personalStats.water.weekData.map(
                              (day) => day.value
                            )
                          )}{" "}
                          glasses
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Goal achievement
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {
                            personalStats.water.weekData.filter(
                              (day) => day.value >= personalStats.water.goal
                            ).length
                          }
                          /7 days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full bg-cyan-600 text-white py-2 rounded-md font-medium hover:scale-102 hover:shadow-lg transition-transform duration-200">
                      Adjust Water Goal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Time Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200">
              <div className="flex items-center mb-4">
                <Smartphone className="text-purple-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Screen Time</h2>
                <div className="ml-auto px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Goal: Under {personalStats.screenTime.goal}h
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={personalStats.screenTime.weekData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 8]} />
                        <Tooltip />
                        <Bar dataKey="value" name="Hours" fill="#A855F7">
                          {personalStats.screenTime.weekData.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.value <= personalStats.screenTime.goal
                                    ? "#A855F7"
                                    : "#E9D5FF"
                                }
                              />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Log Today's Screen Time
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        value={personalStats.screenTime.today}
                        onChange={(e) =>
                          updateStatValue(
                            "screenTime",
                            parseFloat(e.target.value)
                          )
                        }
                        className="flex-grow accent-purple-600 mr-4"
                      />
                      <div className="text-xl font-bold text-gray-800">
                        {personalStats.screenTime.today}h
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0h</span>
                      <span>Goal: Under {personalStats.screenTime.goal}h</span>
                      <span>12h</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Screen Time Stats
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Average this week
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {(
                            personalStats.screenTime.weekData.reduce(
                              (sum, day) => sum + day.value,
                              0
                            ) / 7
                          ).toFixed(1)}
                          h
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Best day</p>
                        <p className="text-xl font-bold text-gray-800">
                          {Math.min(
                            ...personalStats.screenTime.weekData.map(
                              (day) => day.value
                            )
                          )}
                          h
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Goal achievement
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {
                            personalStats.screenTime.weekData.filter(
                              (day) =>
                                day.value <= personalStats.screenTime.goal
                            ).length
                          }
                          /7 days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:scale-102 hover:shadow-lg transition-transform duration-200">
                      Adjust Screen Time Goal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Habits Tab */}
        {activeTab === "habits" && (
          <div className="space-y-6">
            {/* Today's Habits */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Today's Habits
                </h2>
                <div className="text-sm text-sky-600 font-medium">
                  {completedHabits}/{totalHabits} completed
                </div>
              </div>

              <div className="space-y-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className={`${
                            habit.completed ? "text-green-500" : "text-gray-300"
                          } mr-3`}
                        >
                          <CheckCircle size={24} />
                        </button>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {habit.name}
                          </h3>
                          <div className="text-sm text-gray-500">
                            Current streak: {habit.streak} days
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-700 font-medium">
                        {habit.target} {habit.unit}
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="pl-10 pr-4">
                      <input
                        type="range"
                        min="1"
                        max={habit.unit === "minutes" ? 120 : 10}
                        value={habit.target}
                        onChange={(e) =>
                          updateHabitValue(habit.id, parseInt(e.target.value))
                        }
                        className="w-full accent-sky-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1</span>
                        <span>{habit.unit === "minutes" ? 120 : 10}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Habit */}
              {isAddingHabit ? (
                <div className="mt-4 flex items-center">
                  <input
                    type="text"
                    placeholder="New habit..."
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
                  />
                  <button
                    onClick={addNewHabit}
                    className="bg-sky-600 text-white px-4 py-2 rounded-md"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingHabit(false)}
                    className="text-gray-500 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingHabit(true)}
                  className="flex items-center text-sky-600 font-medium mt-4"
                >
                  <PlusCircle size={18} className="mr-1" />
                  Add New Habit
                </button>
              )}
            </div>

            {/* Habit Streaks Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:scale-102 hover:shadow-lg transition-transform duration-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Streak Overview
              </h2>
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        {habit.name}
                      </h3>
                      <div className="flex items-center">
                        <Award className="text-yellow-500 mr-1" size={18} />
                        <span className="font-bold">{habit.streak} days</span>
                      </div>
                    </div>
                    <div className="mt-2 h-2 bg-sky-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (habit.streak / 30) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">Goal: 30 days</span>
                      <span className="text-sky-600">{habit.streak}/30</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Activity Log</h2>
              <div className="flex space-x-2">
                <button className="text-sm text-sky-600 border border-sky-600 px-3 py-1 rounded-md hover:cursor-pointer hover:scale-102 hover:shadow-lg transition-transform duration-200">
                  Filter
                </button>
                <button className="text-sm bg-sky-600 text-white px-3 py-1 rounded-md hover:scale-102 hover:cursor-pointer hover:shadow-lg transition-transform duration-200">
                  Export
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-2">
                  Today - May 2, 2025
                </div>
                <div className="space-y-3">
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-green-100 text-green-600 p-1 rounded mr-3">
                      ✓
                    </span>
                    <span className="flex-grow">
                      Completed "Morning Meditation" (15 minutes)
                    </span>
                    <span className="text-gray-400 text-xs">8:34 AM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-cyan-100 text-cyan-600 p-1 rounded mr-3">
                      <Droplets size={14} />
                    </span>
                    <span className="flex-grow">Logged 3 glasses of water</span>
                    <span className="text-gray-400 text-xs">10:15 AM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3">
                      <Moon size={14} />
                    </span>
                    <span className="flex-grow">Logged 7.5 hours of sleep</span>
                    <span className="text-gray-400 text-xs">7:05 AM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-green-100 text-green-600 p-1 rounded mr-3">
                      ✓
                    </span>
                    <span className="flex-grow">
                      Completed "Journal" (1 entry)
                    </span>
                    <span className="text-gray-400 text-xs">9:20 AM</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">
                  Yesterday - May 1, 2025
                </div>
                <div className="space-y-3">
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-green-100 text-green-600 p-1 rounded mr-3">
                      ✓
                    </span>
                    <span className="flex-grow">
                      Completed "Morning Meditation" (15 minutes)
                    </span>
                    <span className="text-gray-400 text-xs">8:10 AM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-green-100 text-green-600 p-1 rounded mr-3">
                      ✓
                    </span>
                    <span className="flex-grow">
                      Completed "Read" (30 minutes)
                    </span>
                    <span className="text-gray-400 text-xs">7:30 PM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-cyan-100 text-cyan-600 p-1 rounded mr-3">
                      <Droplets size={14} />
                    </span>
                    <span className="flex-grow">Logged 8 glasses of water</span>
                    <span className="text-gray-400 text-xs">9:45 PM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3">
                      <Moon size={14} />
                    </span>
                    <span className="flex-grow">Logged 8 hours of sleep</span>
                    <span className="text-gray-400 text-xs">7:00 AM</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <span className="bg-purple-100 text-purple-600 p-1 rounded mr-3">
                      <Smartphone size={14} />
                    </span>
                    <span className="flex-grow">
                      Logged 3.5 hours of screen time
                    </span>
                    <span className="text-gray-400 text-xs">10:00 PM</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2 text-sky-600 border border-sky-600 rounded-md hover:cursor-pointer hover:scale-101 hover:shadow-lg transition-transform duration-200">
                Load More
              </button>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Performance Trends
              </h2>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Habit Completion Rate
                  </h3>
                  <select className="text-sm border-gray-300 rounded-md">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="habits"
                        name="Completion %"
                        stroke="#6366F1"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-4">
                  Stats Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                  <div className="bg-sky-50 p-4 rounded-lg hover:scale-102 hover:shadow-lg transition-transform duration-200">
                    <div className="mb-2">
                      <span className="text-sm text-sky-600">
                        Habit Consistency
                      </span>
                    </div>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Completed", value: 75 },
                              { name: "Missed", value: 25 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#6366F1" />
                            <Cell fill="#E0E7FF" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-sky-600">75%</p>
                      <p className="text-xs text-gray-500">
                        Average completion rate
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg hover:scale-102 hover:shadow-lg transition-transform duration-200">
                    <div className="mb-2 ">
                      <span className="text-sm text-blue-600">
                        Sleep Quality
                      </span>
                    </div>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Goal Met", value: 57 },
                              { name: "Below Goal", value: 43 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#2563EB" />
                            <Cell fill="#BFDBFE" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">57%</p>
                      <p className="text-xs text-gray-500">
                        Days meeting sleep goal
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg hover:scale-102 hover:shadow-lg transition-transform duration-200">
                    <div className="mb-2">
                      <span className="text-sm text-purple-600">
                        Screen Time
                      </span>
                    </div>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Under Goal", value: 43 },
                              { name: "Over Goal", value: 57 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#A855F7" />
                            <Cell fill="#F3E8FF" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">43%</p>
                      <p className="text-xs text-gray-500">
                        Days under screen time goal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-4">
                  Behavior Correlations
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">
                        On days you exercise, you drink 35% more water
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">
                        Better sleep ({">"}7.5h) correlates with 50% higher
                        habit completion
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">
                        Lower screen time days ({"<"}3h) show increased
                        meditation consistency
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-sky-50 py-2">
        <div className="container mx-auto flex justify-around">
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:scale-102 hover:drop-shadow-sky-300 transition-transform duration-200 ${
              activeTab === "dashboard" ? "text-sky-600 " : "text-gray-500"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <TrendingUp size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:scale-102 hover:drop-shadow-sky-300 transition-transform duration-200 ${
              activeTab === "stats" ? "text-sky-600 " : "text-gray-500"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <Activity size={20} />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:scale-102 hover:drop-shadow-sky-300 transition-transform duration-200  ${
              activeTab === "habits" ? "text-sky-600 " : "text-gray-500"
            }`}
            onClick={() => setActiveTab("habits")}
          >
            <CheckCircle size={20} />
            <span className="text-xs mt-1">Habits</span>
          </button>
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:scale-102 hover:drop-shadow-sky-300 transition-transform duration-200 ${
              activeTab === "activity" ? "text-sky-600 " : "text-gray-500"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            <Calendar size={20} />
            <span className="text-xs mt-1">Activity</span>
          </button>
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:scale-102 hover:drop-shadow-sky-300 transition-transform duration-200  ${
              activeTab === "trends" ? "text-sky-600 " : "text-gray-500"
            }`}
            onClick={() => setActiveTab("trends")}
          >
            <Award size={20} />
            <span className="text-xs mt-1">Trends</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LifeTrackerApp;
