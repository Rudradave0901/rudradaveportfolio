import { useState, useEffect, useCallback } from "react";
import SkillService from "../services/Skill.service";
import { useGlobalLoading } from "../context/LoadingContext";

const useSkills = (fetchOnMount = true) => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const { startLoading, stopLoading } = useGlobalLoading();
    const [error, setError] = useState(null);

    const fetchSkills = useCallback(async () => {
        setLoading(true);
        startLoading('skills');
        setError(null);

        try {
            const data = await SkillService.getAllSkills();

            if (!data?.data) {
                setSkills([]);
                return;
            }

            setSkills(data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch skills");
            setSkills([]);
        } finally {
            setLoading(false);
            stopLoading('skills');
        }
    }, [startLoading, stopLoading]);

    const addSkill = async (formData) => {
        setLoading(true);
        try {
            const data = await SkillService.createSkill(formData);
            await fetchSkills();
            return { success: true, message: data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create skill";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const editSkill = async (id, formData) => {
        setLoading(true);
        try {
            const data = await SkillService.updateSkill(id, formData);
            await fetchSkills();
            return { success: true, message: data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update skill";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const removeSkill = async (id) => {
        setLoading(true);
        try {
            const data = await SkillService.deleteSkill(id);
            await fetchSkills();
            return { success: true, message: data.message };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete skill";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchSkills();
        }
    }, [fetchOnMount, fetchSkills]);

    return {
        skills,
        loading,
        error,
        fetchSkills,
        addSkill,
        editSkill,
        removeSkill,
    };
};

export default useSkills;
