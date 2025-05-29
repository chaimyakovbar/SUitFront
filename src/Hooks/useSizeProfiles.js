import { useState } from "react";

const useSizeProfiles = () => {
    const [sizeProfiles, setSizeProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [sizes, setSizes] = useState({});

    const initializeProfiles = (data) => {
        if (!data?.sizes) return;

        const profiles = Object.entries(data.sizes).reduce((acc, [key, value]) => {
            if (key.startsWith("profile_")) {
                const profileName = key.replace("profile_", "");
                acc.push({
                    name: profileName,
                    sizes: value || {},
                });
            }
            return acc;
        }, []);

        if (profiles.length === 0) {
            const defaultProfile = { name: "Default", sizes: {} };
            setSizeProfiles([defaultProfile]);
            setSelectedProfile(defaultProfile);
            setSizes({});
        } else {
            setSizeProfiles(profiles);
            setSelectedProfile(profiles[0]);
            setSizes(profiles[0].sizes || {});
        }
    };

    return {
        sizeProfiles,
        selectedProfile,
        sizes,
        setSizeProfiles,
        setSelectedProfile,
        setSizes,
        initializeProfiles, // אתה מפעיל את זה בעצמך
    };
}

export default useSizeProfiles;
