"use client";
import {
  Button,
  Card,
  Container,
  Grid,
  Modal,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  RangeSlider,
  Avatar,
  Badge,
} from "@mantine/core";
// import { DateInput } from "@mantine/dates";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import "./globals.css";
import { MapPin, Briefcase, Wallet } from "lucide-react";

import { IconX } from "@tabler/icons-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: Date | null;
  description: string;
  postedDate: Date;
  companyName:string;


};

export default function JobDashboard() {
  const [opened, setOpened] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterJobType, setFilterJobType] = useState("");
  // const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 50]);
const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 80]);

  const { register, handleSubmit, reset, control , formState: { errors }} = useForm<Job>();

  useEffect(() => {
    fetchJobs();
  }, []);

  // const fetchJobs = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/job");
  //     // fetch(`${process.env.NEXT_PUBLIC_API_URL}/job`, ...)

  //     setJobs(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch jobs", error);
  //   }
  // };

  // const getCompanyLogo = (companyName) => {
  //   const fileName = companyName.toLowerCase().replace(/\s+/g, '-');
  //   return `/logo/${fileName}.png`;
  // };
  
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job`);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };
  
  // const onSubmit = async (data: Job) => {
  //   try {
  //     await axios.post("http://localhost:5000/job", data);
  //     fetchJobs();
  //     reset();
  //     setOpened(false);
  //   } catch (error) {
  //     console.error("Error submitting job:", error);
  //   }
  // };
  const onSubmit = async (data: Job) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/job`, data);
      fetchJobs();
      reset();
      setOpened(false);
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };
  
  
  // const handleDelete = async (job: Job) => {
  //   try {
  //     // Pass job.id instead of job.title
  //     await axios.delete(`http://localhost:5000/job/${job.id}`);
  //     fetchJobs(); // Refresh jobs after deletion
  //   } catch (error) {
  //     console.error("Failed to delete job:", error);
  //   }
  // };

  const handleDelete = async (job: Job) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/${job.id}`);
      fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const getShortDescription = (desc: string, wordLimit = 60) => {
    const words = desc.split(" ");
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };
  
  // const filteredJobs = jobs.filter((job) => {
  //   // Convert LPA to ₹K per month
  //   const jobMinK = (job.minSalary * 100) / 12;
  //   const jobMaxK = (job.maxSalary * 100) / 12;

  //   const withinSalary =
  //     jobMinK >= salaryRange[0] && jobMaxK <= salaryRange[1];

  //   return (
  //     job.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
  //     job.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
  //     job.jobType.toLowerCase().includes(filterJobType.toLowerCase()) &&
  //     withinSalary
  //   );
  // });
  const filteredJobs = jobs.filter((job) => {
  const jobMinK = (job.minSalary * 100) / 12;
  const jobMaxK = (job.maxSalary * 100) / 12;

  const withinSalary =
    jobMaxK >= salaryRange[0] && jobMinK <= salaryRange[1];

  return (
    job.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
    job.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
    job.jobType.toLowerCase().includes(filterJobType.toLowerCase()) &&
    withinSalary
  );
});

  
  // const filteredJobs = jobs.filter((job) => {
  //   const withinSalary =
  //     job.minSalary >= salaryRange[0] && job.maxSalary <= salaryRange[1];
  //   return (
  //     job.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
  //     job.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
  //     job.jobType.toLowerCase().includes(filterJobType.toLowerCase()) &&
  //     withinSalary
  //   );
  // });

  return (
    <div className="min-h-screen bg-gray-100">
<nav className="custom-navbar">
  <div className="custom-navbar-container">
    <img src="../cybermindlogo.png" alt="Logo" className="navbar-logo" />
    <div className="navbar-links">
      <a href="#">Home</a>
      <a href="#">Find Jobs</a>
      <a href="#">Find Talents</a>
      <a href="#">About us</a>
      <a href="#">Testimonials</a>
    </div>
    <button className="navbar-button" onClick={() => setOpened(true)}>
      Create Jobs
    </button>
  </div>
</nav>




      <Container size="xl" className="py-8">
        {/* Filter bar */}
        <div className="w-full bg-white p-6 rounded-lg shadow-sm mb-[20px]">
  <div className="flex flex-wrap items-end gap-4">
    <TextInput
      label="Job Title"
      placeholder="e.g. Full Stack Developer"
      value={filterTitle}
      onChange={(e) => setFilterTitle(e.currentTarget.value)}
      className="flex-1 min-w-[150px]"
    />
    <Select
      label="Location"
      placeholder="Select"
      data={["Chennai", "Bangalore", "Hyderabad"]}
      value={filterLocation}
      onChange={(value) => setFilterLocation(value || "")}
      className="flex-1 min-w-[150px]"
    />
    <Select
      label="Job Type"
      placeholder="Select"
      data={["Full-time", "Part-time", "Contract", "Internship"]}
      value={filterJobType}
      onChange={(value) => setFilterJobType(value || "")}
      className="flex-1 min-w-[150px]"
    />
      <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-3">
            Salary Per Month
          </label>
          <RangeSlider  className="mb-4"
            value={salaryRange}
            onChange={(value) =>
              setSalaryRange([...value] as [number, number])
            }
            min={0}
            max={80}
            step={1}
            label={(value) => `₹${value}K`}
            color="dark"
            size="xs"
            marks={[
              { value: 0, label: "₹0K" },
              { value: 80, label: "₹80K" },
            ]}
          />
        </div>
  </div>
</div>


        {/* Jobs Grid */}
        <Grid gutter="lg">
  {filteredJobs.map((job, index) => (
    <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={index}
    style={{ height: "280px" }} >

      <Card
        shadow="sm"
        padding="lg"
        radius="md"
      
        withBorder
        className="h-full flex flex-col justify-between relative"
      >
        {/* Delete button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={() => handleDelete(job)} // Pass the entire job object
        >
          <IconX size={18} />
        </button>

        {/* Job card content */}
        <div>
          <div className="flex justify-between items-center mb-2">
            {/* <Avatar radius="xl" size="md" src="/company-icon.png" /> */}
 <div className="bg-gray-200 p-1 rounded-lg inline-block">

         <Avatar radius="xl" size="md">
  <img
    src={
      job.company
        ? `/logo/${job.company.replace(/\s+/g, '-')}.png` // remove toLowerCase()
        : '/logo/default.png'
    }
    alt={`${job.company || 'Default'} logo`}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = "/logo/default.png"; // fallback logo
    }}
    className="w-full h-full object-cover"
  />
</Avatar>
</div>

 {/* <Avatar radius="xl" size="md">
  <img
    src={
      job.company
        ? `/logo/${job.company.replace(/\s+/g, '-')}.png` // remove toLowerCase()
        : '/logo/default.png'
    }
    alt={`${job.company || 'Default'} logo`}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = "/logo/default.png"; // fallback logo
    }}
    className="w-full h-full object-cover"
  />
</Avatar> */}



            <Badge  color="blue" size="md" variant="light" radius="sm" style={{ color: 'black' }}>
  {(() => {
    const postedDate = new Date(job.postedDate);
    const now = new Date();
    const diffInMs = now.getTime() - postedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  })()}
</Badge>

          </div>
          <div className="font-semibold text-lg mb-1 truncate">{job.title}</div>
          <div className="text-gray-600 text-sm mb-1 truncate">{job.company}</div>
          <ul className="flex flex-wrap text-xs text-gray-700 mb-2 gap-x-4 gap-y-4 items-center">
  <li className="flex items-center gap-1">
    <MapPin size={14} className="text-gray-500" />
    {job.location}
  </li>
  <li className="flex items-center gap-1">
    <Briefcase size={14} className="text-gray-500" />
    {job.jobType}
  </li>
  <li className="flex items-center gap-1">
    <Wallet size={14} className="text-gray-500" />
    ₹{job.maxSalary} LPA
  </li>
</ul>
          {/* <p className="text-[11px] text-gray-500 truncate">
            {job.description
              .split(" ")
              .slice(0, 60)
              .join(" ") + (job.description.split(" ").length > 20 ? "..." : "")}
          </p> */}
          <p className="text-[11px] text-gray-500 line-clamp-2">
  {getShortDescription(job.description)}
</p>
        </div>
        <Button className="apply" fullWidth size="sm" mt="md" radius="md">
          Apply Now
        </Button>
      </Card>
    </Grid.Col>
  ))}
</Grid>
      </Container>

      {/* Create Job Modal */}
{/*       <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create Job Opening"
      size="lg"
      radius="md"
    > */}
      <Modal
  opened={opened}
  onClose={() => setOpened(false)}
  size="lg"
  radius="md"
  withCloseButton={false}
  title={null}
>
  {/* Custom title */}
  <div className="relative mb-4">
    <h2 className="text-center text-xl font-semibold">Create Job Opening</h2>
    <button
      onClick={() => setOpened(false)}
      className="absolute right-0 top-0 text-gray-500 hover:text-black"
    >
      ✕
    </button>
  </div>

  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid grid-cols-2 gap-4">
      {/* Row 1 */}
      <TextInput
        label="Job Title"
        withAsterisk
        placeholder="e.g. Full Stack Developer"
        error={errors.title && "Job title is required"}
        {...register("title", { required: true })}
      />

      <TextInput
        label="Company Name"
        withAsterisk
        placeholder="e.g. Amazon, Microsoft, Swiggy"
        error={errors.company && "Company name is required"}
        {...register("company", { required: true })}
      />

      {/* Row 2 */}
      <Controller
        name="location"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label="Location"
            data={["Bangalore", "Hyderabad", "Chennai", "Delhi", "Mumbai"]}
            withAsterisk
            placeholder="Choose Preferred Location"
            error={errors.location && "Location is required"}
            {...field}
          />
        )}
      />

      <Controller
        name="jobType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label="Job Type"
            data={["Full-Time", "Part-Time", "Internship", "Contract"]}
            withAsterisk
            placeholder="Full-Time"
            error={errors.jobType && "Job type is required"}
            {...field}
          />
        )}
      />

      {/* Row 3 - Salary Range + Deadline */}
      <div className="col-span-2 flex gap-1">
        <Controller
          name="minSalary"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              label="Salary Range"
              placeholder="₹ 100000"
              min={0}
              withAsterisk
              error={errors.minSalary && "Minimum salary is required"}
              {...field}
              className="salary-range"
            />
          )}
        />

        <Controller
          name="maxSalary"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              label=""
              placeholder="₹ 12,00,000"
              min={0}
              withAsterisk
              error={errors.maxSalary && "Maximum salary is required"}
              {...field}
              className="salary-range-max"
            />
          )}
        />

        <Controller
          name="applicationDeadline"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            const valueAsString =
              field.value instanceof Date
                ? field.value.toISOString().split("T")[0]
                : field.value || "";

            return (
              <div className="application-deadline w-full">
                <label
                  htmlFor="applicationDeadline"
                  className="mb-1 text-sm font-medium text-dark-700"
                >
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="applicationDeadline"
                  className={`border rounded px-3 py-2 w-full focus:outline-none ${
                    errors.applicationDeadline
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={valueAsString}
                  onChange={(e) =>
                    field.onChange(new Date(e.target.value))
                  }
                />
                {errors.applicationDeadline && (
                  <p className="text-red-500 text-sm mt-1">
                    Deadline is required
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Job Description */}
      <div className="col-span-2">
        <Textarea
          label="Job Description"
          placeholder="Please share a description to let the candidate know more about the job role"
          withAsterisk
          minRows={5}
          error={errors.description && "Description is required"}
          {...register("description", { required: true })}
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-between items-center mt-6">
      <Button variant="outline">Save Draft</Button>
      <Button type="submit" color="blue" rightSection="→">
        Publish
      </Button>
    </div>
  </form>
</Modal>

    </div>

  );
}
