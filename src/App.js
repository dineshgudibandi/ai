import {useEffect, useState} from 'react';
import Papa from 'papaparse';
import axios from 'axios'; // Import Axios
import './App.css';

export default function App(props) {
    const [csvData, setCsvData] = useState([]);
//only call fetchCSVData on initial render

    useEffect(() => {
        fetchCSVData();
    }, []);
    const [filter, setFilter] = useState({name: '', category: '', description: ''});

    const filteredData = csvData.filter((data) =>
        data.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        data.category.toLowerCase().includes(filter.category.toLowerCase()) &&
        data.description.toLowerCase().includes(filter.description.toLowerCase())
    );

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilter({...filter, [name]: value});
    };
    const fetchCSVData = () => {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmKOIx7RvYAUXcOkmVTamEGt2P3V-CITNCEwIRMKTMytN2zFNRE0SqSgluKZlBC4D8xDYyGYLZF5yh/pub?output=csv'; // Replace with your Google Sheets CSV file URL

        axios.get(csvUrl)    // Use Axios to fetch the CSV data
            .then((response) => {
                const parsedCsvData = Papa.parse(response.data, {header: true}).data;
                setCsvData(parsedCsvData);        // Set the fetched data in the component's state
            })
            .catch((error) => {
                console.error('Error fetching CSV data:', error);
            });
    }
    return csvData.length > 0 ? (
        <div className="table-container">
            <h1>AI Tools</h1>
            <table>
                <thead>
                <tr className="filters">
                    <th>Name<br/>
                        <input
                            type="text"
                            name="name"
                            placeholder="Filter by Name"
                            value={filter.name}
                            onChange={handleFilterChange}
                        /></th>
                    <th>Category<br/>
                        <input
                            type="text"
                            name="category"
                            placeholder="Filter by Category"
                            value={filter.category}
                            onChange={handleFilterChange}
                        /></th>
                    <th>Description<br/>
                        <input
                            type="text"
                            name="description"
                            placeholder="Filter by Category"
                            value={filter.description}
                            onChange={handleFilterChange}
                        /></th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((data, index) => (
                    <tr key={index}>
                        <td><a href={data.url} target="_new">{data.name}</a></td>
                        <td>{data.category}</td>
                        <td>{data.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>) : '';

}
