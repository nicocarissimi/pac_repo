import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function GET(learning_time: number, favoriteCategories: string[] ){
        // candidates i a list of combinations so a list of list
        // if duration > learning_time automatically video can't be inside a valid candidate
        // where candidate is a combination of video where the sum all video durations is less than or equals to learning_time value
        const result = await prismadb.video.findMany({
            where: {
                duration: {
                    lte: learning_time
                },
                categories: {
                    some: {
                        category: {
                            name: {
                                in: favoriteCategories
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                videoUrl: true,
                duration: true,
                categories: {
                    where: {
                        category: {
                            name: {
                                in: favoriteCategories
                            }
                        }
                    },
                    select: {
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        var videos = result.map(video => ({
            ...video,
            categories: video.categories.map(cat => cat.category.name)
        }));
        
        const solution = evaluateSolution(videos, learning_time)

        return solution

}

interface Video {
    categories: string[];
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
}


function evaluateSolution(videos: Video[], learning_time: number){
    const solution: Video[] = [];
    let total = 0;

    // Inizializza un Set per tracciare le categorie incluse nella soluzione
    const includedCategories = new Set<string>();

    // Trovare il video con il minor numero di categorie inizialmente
    let maxCategoriesVideo = null;
    let maxCategoriesCount = Infinity;
    let maxVideoIndex = 0

    for (let k=0; k<videos.length; k++) {
        const categoriesCount = videos[k].categories.length;
        if (categoriesCount > maxCategoriesCount) {
            maxCategoriesCount = categoriesCount;
            maxCategoriesVideo = videos[k];
            maxVideoIndex = k
        }
    }

    if (maxCategoriesVideo) {
        total += maxCategoriesVideo.duration;
        solution.push(maxCategoriesVideo);
        maxCategoriesVideo.categories.forEach(category => includedCategories.add(category)); // Aggiungi categorie al Set
        [videos[maxVideoIndex], videos[videos.length-1]] = [videos[videos.length-1], videos[maxVideoIndex]] 
        videos.pop()
    }

    while (videos.length > 0 && total < learning_time) {
        const {index, video: selectedVideo} = candidateSelection(videos, includedCategories, total, learning_time);
        if (selectedVideo) {
            total += selectedVideo.duration;
            solution.push(selectedVideo);
            selectedVideo.categories.forEach(category => includedCategories.add(category)); // Aggiungi nuove categorie
            [videos[index], videos[videos.length-1]] = [videos[videos.length-1], videos[index]]
            videos.pop()
        }else{
            break
        }
    }
    return solution;
}

// the candidates must satisfy duration condition and to have more categories than other candidates which aren't already in solution list
function candidateSelection(videos: Video[], includedCategories: Set<string>, total: number, learning_time:number) {
    let maxVideo =  {} as {index: number, video: Video};
    let maxCount = 0;
    let minDuration = Infinity;

    for (let k = 0; k<videos.length; k++) {
        if(videos[k].duration + total < learning_time) {
            // Conta le categorie non incluse nella soluzione
            const count = videos[k].categories.filter(category => !includedCategories.has(category)).length;
            
            // Se il conteggio delle categorie è maggiore del massimo trovato
            if (count > maxCount || (count === maxCount && videos[k].duration < minDuration)) {
                maxCount = count;
                maxVideo.index = k
                maxVideo.video = videos[k];
                minDuration = videos[k].duration;
            }
        }
    }

    return maxVideo;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {currentUser} = await serverAuth(req)
    if (req.method === 'GET') {
        if(currentUser.learning_time && currentUser.learning_time > 0) {
            const {favoriteCategories, learning_time} = currentUser
            const categories = favoriteCategories.map(c=>c.category.name)
            const videos = await GET(learning_time, categories)
            return res.status(200).json(videos)    
        }
        return res.status(200).json({})
    }

}