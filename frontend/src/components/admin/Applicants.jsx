// This goes in your admin/Applicants.jsx component
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from 'axios';

const Applicants = () => {
    const { id } = useParams(); // job ID
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch applicants for the job
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/application/${id}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setApplicants(res.data.job.applications);
                }
            } catch (error) {
                console.error('Error fetching applicants:', error);
                toast.error('Failed to fetch applicants');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [id]);

    // Handle resume viewing for recruiters
    const viewApplicantResume = (applicantUserId, applicantName) => {
        if (applicantUserId) {
            const viewUrl = `http://localhost:8000/api/v1/user/resume/view/${applicantUserId}`;
            window.open(viewUrl, '_blank', 'noopener,noreferrer');
        } else {
            toast.error(`Unable to view ${applicantName}'s resume`);
        }
    };

    // Handle resume download for recruiters
    const downloadApplicantResume = (applicantUserId, applicantName) => {
        if (applicantUserId) {
            const downloadUrl = `http://localhost:8000/api/v1/user/resume/view/${applicantUserId}?download=true`;
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success(`${applicantName}'s resume download started`);
        } else {
            toast.error(`Unable to download ${applicantName}'s resume`);
        }
    };

    // Update application status
    const updateStatus = async (applicationId, status) => {
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/application/status/${applicationId}/update`,
                { status },
                { withCredentials: true }
            );
            
            if (res.data.success) {
                // Update local state
                setApplicants(prev => 
                    prev.map(app => 
                        app._id === applicationId 
                            ? { ...app, status } 
                            : app
                    )
                );
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'accepted':
                return 'default'; // green
            case 'rejected':
                return 'destructive'; // red
            default:
                return 'secondary'; // gray
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading applicants...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Applicants</h1>
                <p className="text-gray-600">{applicants.length} applications received</p>
            </div>

            {applicants.length === 0 ? (
                <div className="text-center p-8">
                    <p className="text-gray-500">No applications received yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableCaption>List of job applicants</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Resume</TableHead>
                                <TableHead>Date Applied</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicants.map((application) => (
                                <TableRow key={application._id}>
                                    <TableCell className="font-medium">
                                        {application.applicant?.fullname}
                                    </TableCell>
                                    <TableCell>
                                        {application.applicant?.email}
                                    </TableCell>
                                    <TableCell>
                                        {application.applicant?.phoneNumber}
                                    </TableCell>
                                    <TableCell>
                                        {application.applicant?.profile?.resume ? (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewApplicantResume(
                                                        application.applicant._id,
                                                        application.applicant.fullname
                                                    )}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => downloadApplicantResume(
                                                        application.applicant._id,
                                                        application.applicant.fullname
                                                    )}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Download
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No resume</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(application.status)}>
                                            {application.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateStatus(application._id, 'accepted')}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateStatus(application._id, 'rejected')}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default Applicants;