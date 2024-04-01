import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(2);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://dev.internbazr.com/candidate/test/data');
      const data = await response.json();
      setJobs(data.data);
      setFilteredJobs(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterJobs(event.target.value);
  };

  const filterJobs = (searchTerm) => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const sortJobs = (type) => {
    setSortType(type);
    const sorted = [...filteredJobs].sort((a, b) => {
      if (type === 'salary') {
        // Assuming salary is in the format "XXX,XXX $YYY,YYY", we need to extract the numeric part before sorting
        const salaryA = parseInt(a.salary.split(' ')[0].replace(',', ''));
        const salaryB = parseInt(b.salary.split(' ')[0].replace(',', ''));
        return salaryA - salaryB;
      } else if (type === 'location') {
        return a.location.localeCompare(b.location);
      }
      // Add other sorting types as needed
      return 0;
    });
    setFilteredJobs(sorted);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Job Listings</h1>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={() => sortJobs('salary')}>Sort by Salary</button>
        <button onClick={() => sortJobs('location')}>Sort by Location</button>
        {/* Add other sorting buttons as needed */}
      </nav>

      <div className="job-cards">
        {currentJobs.map(job => (
          <div key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <p>{job.company} - {job.location}</p>
            <p>{job.description}</p>
            {/* Display other job details */}
            <h4>Salary: {job.salary}</h4>
            <h4>Salary: {job.sortType}</h4>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Job Listings App</p>
      </footer>
    </div>
  );
}

export default App;
