import React, {useEffect, useState} from "react";
import {View, Text, SectionList, StyleSheet, Alert, TouchableOpacity, FlatList} from "react-native";
import {useRouter} from "expo-router";
import DailyChecklistService from "../../Services/DailyChecklistService";

const DailyChecklistHistory = () => {
    const [groupedHistory, setGroupedHistory] = useState([]);
    // const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // Current page
    const [hasMore, setHasMore] = useState(true); // Whether there are more records
    const pageSize = 10; // Number of records per page

    useEffect(() => {
        fetchHistory(true); // Fetch the first page
    }, []);

    useEffect(() => {
        setGroupedHistory(groupHistoryByPet(history));
    }, [history]);

    const fetchHistory = async (reset = false) => {
        if (loading) return; // Prevent multiple requests
        setLoading(true);

        try {
            const nextPage = reset ? 0 : page;
            const data = await DailyChecklistService.getPaginatedDailyChecklists(nextPage, pageSize);

            if (data.content.length < pageSize) {
                setHasMore(false); // No more data available
            }

            const updatedHistory = reset ? data.content : [...history, ...data.content];
            setHistory(updatedHistory); // Reset or append data
            setGroupedHistory(groupHistoryByPet(updatedHistory)); // Group by pet after appending
            setPage(reset ? 1 : nextPage + 1); // Update page count
        } catch (error) {
            console.error("Error fetching checklist history:", error);
            Alert.alert("Error", "Failed to fetch checklist history.");
        } finally {
            setLoading(false);
        }
    };



    const groupHistoryByPet = (history) => {
        const grouped = history.reduce((acc, checklist) => {
            const petId = checklist.petId;
            if (!acc[petId]) {
                acc[petId] = {
                    petId,
                    data: [],
                };
            }
            acc[petId].data.push(checklist);
            return acc;
        }, {});

        return Object.values(grouped).map((group) => ({
            title: `Pet ID: ${group.petId}`,
            data: group.data,
        }));
    };

    const handleViewChecklist = (checklist) => {
        router.push({
            pathname: "/VetAssistantStack/DailyChecklist",
            params: {
                petId: checklist.petId,
                petName: `Pet ${checklist.petId}`, // Replace with pet name if available
                checklistId: checklist.id, // Pass the checklist ID for detailed view
                mode: "view", // Indicate that it's view mode
            },
        });
    };

    const renderChecklistItem = ({item}) => (
        <View style={styles.historyCard}>
            <View style={styles.row}>
                <View style={styles.textContainer}>
                    <Text style={styles.date}>📅 Date: {item.date}</Text>
                    <Text style={styles.observations}>
                        📝 Observations: {item.healthObservations || "None"}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewChecklist(item)}
                >
                    <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );


    const renderSectionHeader = ({section}) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Checklist History...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Checklist History</Text>
            <SectionList
                sections={groupedHistory}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderChecklistItem}
                renderSectionHeader={renderSectionHeader}
                ListEmptyComponent={<Text style={styles.emptyText}>No history available</Text>}
                ListFooterComponent={
                    hasMore && (
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={() => fetchHistory(false)} // Load more records
                            disabled={loading}
                        >
                            <Text style={styles.loadMoreText}>
                                {loading ? "Loading..." : "Load More"}
                            </Text>
                        </TouchableOpacity>
                    )
                }
                onEndReachedThreshold={0.1} // Trigger `onEndReached` close to the end of the list
            />
        </View>
    );

};

const styles = StyleSheet.create({
    loadMoreButton: {
        backgroundColor: "#5DADE2",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    loadMoreText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold",
    },




    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        marginRight: 10, // Add spacing between text and button
    },
    viewButton: {
        backgroundColor: "#5DADE2",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    viewButtonText: {
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "bold",
    },


    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#34495E",
        textAlign: "center",
    },
    historyCard: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    date: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    observations: {
        fontSize: 14,
        color: "#34495E",
        marginBottom: 10,
    },
    // viewButton: {
    //     backgroundColor: "#5DADE2",
    //     paddingVertical: 10,
    //     borderRadius: 8,
    //     alignItems: "center",
    // },
    // viewButtonText: {
    //     fontSize: 16,
    //     color: "#FFFFFF",
    //     fontWeight: "bold",
    // },
    sectionHeader: {
        backgroundColor: "#D1E1F6",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#7F8C8D",
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
        color: "#7F8C8D",
        marginTop: 20,
    },
});

export default DailyChecklistHistory;
